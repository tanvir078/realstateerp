import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Employee, AttendanceRecord, PayrollRun, LeaveRequest, EmployeeLoan, LoanRepayment, PerformanceReview } from './entities/hr-workflow.entity';
import { PayrollLedgerEntry } from './entities/payroll-ledger.entity';
import { PayrollLine } from './entities/payroll-line.entity';
import { CreateAttendanceDto, CreateEmployeeDto, CreatePayrollDto, UpdateEmployeeDto, UpdateAttendanceDto, CreateLeaveDto, CreateLoanDto, CreateRepaymentDto, CreatePerformanceReviewDto } from './dtos/hr.dto';
import { PayPayrollDto } from './dtos/pay-payroll.dto';
import { AccountingPeriodService } from '../accounting/period.service';
import { TaxService } from '../accounting/tax.service';
import { TaxType } from '../accounting/entities/tax-configuration.entity';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee) private employees: Repository<Employee>,
    @InjectRepository(AttendanceRecord) private attendance: Repository<AttendanceRecord>,
    @InjectRepository(PayrollRun) private payroll: Repository<PayrollRun>,
    @InjectRepository(PayrollLedgerEntry) private payrollLedger: Repository<PayrollLedgerEntry>,
    @InjectRepository(PayrollLine) private payrollLines: Repository<PayrollLine>,
    @InjectRepository(LeaveRequest) private leaves: Repository<LeaveRequest>,
    @InjectRepository(EmployeeLoan) private loans: Repository<EmployeeLoan>,
    @InjectRepository(LoanRepayment) private repayments: Repository<LoanRepayment>,
    @InjectRepository(PerformanceReview) private reviews: Repository<PerformanceReview>,
    private dataSource: DataSource,
    private periodService: AccountingPeriodService,
    private taxService: TaxService,
    private accountingService: AccountingService = {} as AccountingService,
  ) {}

  findEmployees() {
    return this.employees.find({ order: { fullName: 'ASC' } });
  }

  async createEmployee(dto: CreateEmployeeDto) {
    return this.employees.save(
      this.employees.create({
        ...dto,
        employeeId: `EMP-${new Date().getFullYear()}-${String((await this.employees.count()) + 1).padStart(3, '0')}`,
      }),
    );
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.employees.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    Object.assign(employee, dto);
    return this.employees.save(employee);
  }

  findAttendance() {
    return this.attendance.find({ order: { date: 'DESC' } });
  }

  async recordAttendance(dto: CreateAttendanceDto) {
    const employee = await this.employees.findOne({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');
    const existing = await this.attendance.findOne({ where: { employeeId: dto.employeeId, date: dto.date } });
    if (existing) throw new ConflictException('Attendance already exists for this employee and date');
    return this.attendance.save(this.attendance.create(dto));
  }

  async updateAttendance(id: string, dto: UpdateAttendanceDto) {
    const record = await this.attendance.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Attendance record not found');
    if (dto.date && dto.date !== record.date) {
      const duplicate = await this.attendance.findOne({ where: { employeeId: record.employeeId, date: dto.date } });
      if (duplicate) throw new ConflictException('Attendance already exists for this employee and date');
    }
    Object.assign(record, dto);
    return this.attendance.save(record);
  }

  findLeaves() { return this.leaves.find({ order: { createdAt: 'DESC' } }); }

  async createLeave(dto: CreateLeaveDto) {
    const employee = await this.employees.findOne({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');
    if (dto.endDate < dto.startDate) throw new UnprocessableEntityException('Leave end date cannot be before start date');
    return this.leaves.save(this.leaves.create(dto));
  }

  async decideLeave(id: string, status: 'APPROVED' | 'REJECTED', decisionNote?: string) {
    const leave = await this.leaves.findOne({ where: { id } });
    if (!leave) throw new NotFoundException('Leave request not found');
    if (leave.status !== 'PENDING') throw new UnprocessableEntityException('Only pending leave can be decided');
    leave.status = status;
    leave.decisionNote = decisionNote;
    return this.leaves.save(leave);
  }

  findLoans() { return this.loans.find({ order: { createdAt: 'DESC' } }); }

  async createLoan(dto: CreateLoanDto) {
    const employee = await this.employees.findOne({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');
    if (dto.installmentAmount > dto.principal) throw new UnprocessableEntityException('Installment cannot exceed principal');
    return this.loans.save(this.loans.create({ ...dto, outstanding: dto.principal }));
  }

  async repayLoan(id: string, dto: CreateRepaymentDto) {
    const loan = await this.loans.findOne({ where: { id } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status !== 'ACTIVE' || dto.amount > Number(loan.outstanding)) throw new UnprocessableEntityException('Invalid loan repayment');
    return this.dataSource.transaction(async (manager) => {
      loan.outstanding = Number(loan.outstanding) - dto.amount;
      if (loan.outstanding === 0) loan.status = 'PAID';
      await manager.save(loan);
      return manager.save(LoanRepayment, manager.create(LoanRepayment, { loanId: id, ...dto }));
    });
  }

  findPerformanceReviews() { return this.reviews.find({ order: { createdAt: 'DESC' } }); }

  async createPerformanceReview(dto: CreatePerformanceReviewDto) {
    const employee = await this.employees.findOne({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');
    return this.reviews.save(this.reviews.create({ ...dto, status: 'SUBMITTED' }));
  }

  findPayroll() {
    return this.payroll.find({ order: { createdAt: 'DESC' } });
  }

  async findPayslips() {
    const lines = await this.payrollLines.find({ order: { year: 'DESC', month: 'DESC', employeeName: 'ASC' } });
    const payrollIds = [...new Set(lines.map((line) => line.payrollId))];
    const payrollRuns = payrollIds.length ? await this.payroll.findBy({ id: In(payrollIds) }) : [];
    const statusByPayroll = new Map(payrollRuns.map((run) => [run.id, run.status]));
    return lines.map((line) => ({ ...line, payrollStatus: statusByPayroll.get(line.payrollId) ?? 'UNKNOWN' }));
  }

  async findPayslip(id: string) {
    const payslip = await this.payrollLines.findOne({ where: { id } });
    if (!payslip) throw new NotFoundException('Payslip not found');
    const payroll = await this.payroll.findOne({ where: { id: payslip.payrollId } });
    return { ...payslip, payrollStatus: payroll?.status ?? 'UNKNOWN' };
  }

  async createPayroll(dto: CreatePayrollDto) {
    if (await this.payroll.findOne({ where: { month: dto.month, year: dto.year } })) {
      throw new ConflictException('Payroll already exists for this period');
    }

    const employees = await this.employees.find({ where: { status: 'ACTIVE' } });
    const gross = employees.reduce(
      (sum, employee) =>
        sum +
        Number(employee.basicSalary) +
        Number(employee.houseRent) +
        Number(employee.medicalAllowance) +
        Number(employee.siteAllowance),
      0,
    );
    const pf = employees.reduce(
      (sum, employee) => sum + Number(employee.basicSalary) * dto.providentFundPercent / 100,
      0,
    );
    const net = gross - pf - dto.otherDeduction;

    return this.dataSource.transaction(async (manager) => {
      const payrollRun = manager.create(PayrollRun, {
        ...dto,
        payrollNo: `PAY-${dto.year}-${dto.month}`,
        grossAmount: gross,
        totalDeduction: pf + dto.otherDeduction,
        netPayable: net,
        status: 'DRAFT',
        paidAmount: 0,
      });
      const savedRun = await manager.save(payrollRun);
      const lines = employees.map((employee) => {
        const employeeGross = Number(employee.basicSalary) + Number(employee.houseRent) +
          Number(employee.medicalAllowance) + Number(employee.siteAllowance);
        const employeePf = Number(employee.basicSalary) * dto.providentFundPercent / 100;
        const employeeOtherDeduction = gross > 0 ? dto.otherDeduction * employeeGross / gross : 0;
        return manager.create(PayrollLine, {
          payslipNo: `PS-${dto.year}-${dto.month}-${employee.employeeId}`,
          payrollId: savedRun.id,
          payrollNo: savedRun.payrollNo,
          employeeId: employee.id,
          employeeCode: employee.employeeId,
          employeeName: employee.fullName,
          department: employee.department,
          designation: employee.designation,
          month: dto.month,
          year: dto.year,
          basicSalary: Number(employee.basicSalary),
          houseRent: Number(employee.houseRent),
          medicalAllowance: Number(employee.medicalAllowance),
          siteAllowance: Number(employee.siteAllowance),
          allowances: Number(employee.houseRent) + Number(employee.medicalAllowance) + Number(employee.siteAllowance),
          grossAmount: employeeGross,
          providentFund: employeePf,
          otherDeduction: employeeOtherDeduction,
          totalDeduction: employeePf + employeeOtherDeduction,
          netPayable: employeeGross - employeePf - employeeOtherDeduction,
        });
      });
      await manager.save(PayrollLine, lines);
      return savedRun;
    });
  }

  async approvePayroll(id: string) {
    const run = await this.payroll.findOne({ where: { id } });
    if (!run) throw new NotFoundException('Payroll not found');
    if (run.status !== 'DRAFT') throw new UnprocessableEntityException('Only draft payroll can be approved');
    run.status = 'APPROVED';
    return this.payroll.save(run);
  }

  async postPayroll(id: string) {
    return this.dataSource.transaction(async (manager) => {
      const run = await manager.findOne(PayrollRun, { where: { id } });
      if (!run) throw new NotFoundException('Payroll not found');
      if (run.status !== 'APPROVED') throw new UnprocessableEntityException('Only approved payroll can be posted');
      const postingDate = new Date().toISOString().slice(0, 10);
      await this.periodService.ensureOpen(postingDate);
      const tds = await this.taxService.calculate(TaxType.TDS, Number(run.grossAmount), postingDate);
      const withholdingAmount = tds.accountCode ? tds.taxAmount : 0;
      run.withholdingAmount = withholdingAmount;
      run.netPayable = Number(run.netPayable) - withholdingAmount;

      const salaryExpense = this.accountingService.getMappedAccountCode
        ? await this.accountingService.getMappedAccountCode('salary_expense', '6100')
        : '6100';
      const salaryPayable = this.accountingService.getMappedAccountCode
        ? await this.accountingService.getMappedAccountCode('salary_payable', '2200')
        : '2200';
      const deductionPayable = this.accountingService.getMappedAccountCode
        ? await this.accountingService.getMappedAccountCode('payroll_deduction_payable', '2210')
        : '2210';
      const grossEntry = manager.create(PayrollLedgerEntry, {
        referenceType: 'PAYROLL_POST',
        referenceId: run.id,
        projectId: run.projectId ?? null,
        debitAccountCode: salaryExpense,
        creditAccountCode: salaryPayable,
        amount: Number(run.grossAmount),
        postingDate,
      });
      const liabilityEntries = [
        Number(run.totalDeduction) > 0 && manager.create(PayrollLedgerEntry, {
          referenceType: 'PAYROLL_DEDUCTION',
          referenceId: run.id,
          projectId: run.projectId ?? null,
          debitAccountCode: salaryPayable,
          creditAccountCode: deductionPayable,
          amount: run.totalDeduction,
          postingDate,
        }),
      ].filter(Boolean);
      if (withholdingAmount > 0 && tds.accountCode) {
       liabilityEntries.push(manager.create(PayrollLedgerEntry, {
         referenceType: 'PAYROLL_TDS',
         referenceId: run.id,
         projectId: run.projectId ?? null,
         debitAccountCode: salaryPayable,
         creditAccountCode: tds.accountCode,
         amount: withholdingAmount,
         postingDate,
       }));
      }

      run.status = 'POSTED';
      await manager.save(run);
      await manager.save([grossEntry, ...liabilityEntries]);

      return { payroll: run, ledger: grossEntry, entries: [grossEntry, ...liabilityEntries] };
    });
  }

  async payPayroll(id: string, dto: PayPayrollDto) {
    return this.dataSource.transaction(async (manager) => {
      const run = await manager.findOne(PayrollRun, { where: { id } });
      if (!run) throw new NotFoundException('Payroll not found');
      await this.periodService.ensureOpen(dto.paymentDate);
      if (run.status !== 'POSTED' && run.status !== 'PARTIAL') {
        throw new UnprocessableEntityException('Only posted payroll can be paid');
      }

      const due = Number(run.netPayable) - Number(run.paidAmount);
      if (dto.amount > due) {
        throw new UnprocessableEntityException('Payment exceeds payroll outstanding balance');
      }

      run.paidAmount = Number(run.paidAmount) + dto.amount;
      run.status = run.paidAmount === Number(run.netPayable) ? 'PAID' : 'PARTIAL';

      const paymentAccount = this.accountingService.resolvePaymentAccount
        ? await this.accountingService.resolvePaymentAccount(dto.paymentMethod ?? 'bank', dto.accountCode)
        : '1100';
      const salaryPayable = this.accountingService.getMappedAccountCode
        ? await this.accountingService.getMappedAccountCode('salary_payable', '2200')
        : '2200';
      const entry = manager.create(PayrollLedgerEntry, {
        referenceType: 'PAYROLL_PAYMENT',
        referenceId: run.id,
        projectId: run.projectId ?? null,
        debitAccountCode: salaryPayable,
        creditAccountCode: paymentAccount,
        amount: dto.amount,
        postingDate: dto.paymentDate,
      });

      await manager.save(run);
      await manager.save(entry);

      return { payroll: run, ledger: entry };
    });
  }
}
