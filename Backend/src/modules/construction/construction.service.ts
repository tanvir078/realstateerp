import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MaterialRequisition, ConstructionWorkOrder, RABill } from './entities/construction-workflow.entity';
import { CreateMRNDto, CreateRABillDto, CreateWorkOrderDto, UpdateWorkOrderDto } from './dtos/construction-workflow.dto';
import { ConstructionLedgerEntry } from './entities/construction-ledger.entity';
import { ConstructionPaymentDto } from './dtos/construction-payment.dto';
import { Contractor } from './entities/contractor.entity';
import { ConstructionEquipment } from './entities/equipment.entity';
import { ConstructionFuelLog } from './entities/fuel-log.entity';
import { SiteLaborRecord } from './entities/site-labor.entity';
import { CreateSiteLaborDto, DisburseSiteLaborDto } from './dtos/site-labor.dto';
import { AccountingPeriodService } from '../accounting/period.service';
import { AccountingService } from '../accounting/accounting.service';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class ConstructionService {
  constructor(@InjectRepository(MaterialRequisition) private mrns: Repository<MaterialRequisition>, @InjectRepository(ConstructionWorkOrder) private orders: Repository<ConstructionWorkOrder>, @InjectRepository(RABill) private bills: Repository<RABill>, @InjectRepository(ConstructionLedgerEntry) private ledger: Repository<ConstructionLedgerEntry>, @InjectRepository(Contractor) private contractors: Repository<Contractor>, @InjectRepository(ConstructionEquipment) private equipment: Repository<ConstructionEquipment>, @InjectRepository(ConstructionFuelLog) private fuelLogs: Repository<ConstructionFuelLog>, @InjectRepository(SiteLaborRecord) private labor: Repository<SiteLaborRecord>, @InjectRepository(Project) private projects: Repository<Project>, private dataSource: DataSource, private periodService: AccountingPeriodService, private accountingService: AccountingService) {}
  findContractors() { return this.contractors.find({ order: { createdAt: 'DESC' } }); }
  async createContractor(dto: Partial<Contractor>) {
    if (!dto.name || !dto.type || !dto.contact || !dto.projectId) {
      throw new UnprocessableEntityException('Contractor type, name, contact and project are required');
    }
    if (!await this.projects.findOne({ where: { id: dto.projectId } })) {
      throw new UnprocessableEntityException('Selected project was not found');
    }
    if (dto.contractBasis === 'UNIT_RATE' && (!dto.quantity || !dto.rate || !dto.measurementUnit)) {
      throw new UnprocessableEntityException('Quantity, unit and rate are required for unit-rate contracts');
    }
    const contractValue = dto.contractBasis === 'UNIT_RATE'
      ? Number(dto.quantity) * Number(dto.rate)
      : dto.contractValue;
    const contractor = this.contractors.create({ ...dto, contractorCode: `CON-${new Date().getFullYear()}-${String((await this.contractors.count()) + 1).padStart(3, '0')}`, contractValue, status: dto.status ?? 'PENDING' });
    return this.contractors.save(contractor);
  }
  async updateContractor(id: string, dto: Partial<Contractor>) {
    const contractor = await this.contractors.findOne({ where: { id } });
    if (!contractor) throw new NotFoundException('Contractor not found');
    Object.assign(contractor, dto);
    return this.contractors.save(contractor);
  }
  async deleteContractor(id: string) {
    const contractor = await this.contractors.findOne({ where: { id } });
    if (!contractor) throw new NotFoundException('Contractor not found');
    const orders = await this.orders.count({ where: { contractorId: id } });
    if (orders) throw new ConflictException('Contractor with work orders cannot be deleted');
    await this.contractors.remove(contractor);
    return { success: true };
  }
  findEquipment() { return this.equipment.find({ order: { createdAt: 'DESC' } }); }
  async createEquipment(dto: Partial<ConstructionEquipment>) {
    if (!dto.name || !dto.type) throw new UnprocessableEntityException('Equipment name and type are required');
    return this.equipment.save(this.equipment.create({ ...dto, status: dto.status ?? 'ACTIVE', fuelConsumptionPerDay: dto.fuelConsumptionPerDay ?? 0 }));
  }
  async updateEquipment(id: string, dto: Partial<ConstructionEquipment>) {
    const item = await this.equipment.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Equipment not found');
    Object.assign(item, dto);
    return this.equipment.save(item);
  }
  async deleteEquipment(id: string) {
    const item = await this.equipment.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Equipment not found');
    if (await this.fuelLogs.count({ where: { equipmentId: id } })) throw new ConflictException('Equipment with fuel logs cannot be deleted');
    await this.equipment.remove(item);
    return { success: true };
  }
  findFuelLogs() { return this.fuelLogs.find({ order: { date: 'DESC', createdAt: 'DESC' } }); }
  async createFuelLog(dto: Partial<ConstructionFuelLog>) {
    if (!dto.equipmentId || !dto.date || !dto.quantity || !dto.rate || !dto.supplier) throw new UnprocessableEntityException('Equipment, date, quantity, rate and supplier are required');
    if (!await this.equipment.findOne({ where: { id: dto.equipmentId } })) throw new NotFoundException('Equipment not found');
    return this.fuelLogs.save(this.fuelLogs.create(dto));
  }
  findLabor() { return this.labor.find({ order: { date: 'DESC', createdAt: 'DESC' } }); }
  async createLabor(dto: CreateSiteLaborDto) {
    if (!dto.projectSite || !dto.contractor || !dto.date) throw new UnprocessableEntityException('Project site, contractor and date are required');
    if (!dto.projectId || !await this.projects.findOne({ where: { id: dto.projectId } })) {
      throw new UnprocessableEntityException('A valid project is required for site labour');
    }
    const values = ['masonsCount', 'masonsRate', 'helpersCount', 'helpersRate', 'electriciansCount', 'electriciansRate', 'carpentersCount', 'carpentersRate', 'overtimeHours', 'overtimeRate'].map((key) => Number(dto[key] ?? 0));
    const [masonsCount, masonsRate, helpersCount, helpersRate, electriciansCount, electriciansRate, carpentersCount, carpentersRate, overtimeHours, overtimeRate] = values;
    const totalPayable = masonsCount * masonsRate + helpersCount * helpersRate + electriciansCount * electriciansRate + carpentersCount * carpentersRate + overtimeHours * overtimeRate;
    if (values.some((value) => !Number.isFinite(value) || value < 0)) throw new UnprocessableEntityException('Labor counts, rates and overtime values must be non-negative numbers');
    if (totalPayable <= 0) throw new UnprocessableEntityException('At least one labor category or overtime amount is required');
    return this.labor.save(this.labor.create({ ...dto, projectId: dto.projectId ?? null, masonsCount, masonsRate, helpersCount, helpersRate, electriciansCount, electriciansRate, carpentersCount, carpentersRate, overtimeHours, overtimeRate, totalPayable: Math.round(totalPayable * 100) / 100, status: 'PENDING' }));
  }
  async approveLabor(id: string) {
    const record = await this.labor.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Labor record not found');
    if (record.status !== 'PENDING') throw new UnprocessableEntityException('Only pending labor records can be approved');
    record.status = 'APPROVED';
    return this.labor.save(record);
  }
  async disburseLabor(id: string, dto: DisburseSiteLaborDto) {
    return this.dataSource.transaction(async (manager) => {
      const record = await manager.findOne(SiteLaborRecord, { where: { id } });
      if (!record) throw new NotFoundException('Labor record not found');
      if (record.status !== 'APPROVED') throw new UnprocessableEntityException('Only approved labor can be disbursed');
      record.status = 'PAID';
      record.disbursementDate = dto.disbursementDate || new Date().toISOString().slice(0, 10);
      await this.periodService.ensureOpen(record.disbursementDate);
      record.paymentMethod = dto.paymentMethod;
      record.referenceNumber = dto.referenceNumber;
      record.notes = dto.notes;
      const existingEntry = await manager.findOne(ConstructionLedgerEntry, { where: { referenceType: 'SITE_LABOR_PAYMENT', referenceId: record.id } });
      if (existingEntry) throw new ConflictException('Labor payment has already been posted');
      if (!record.projectId) throw new UnprocessableEntityException('Project is required for site labour posting');
      const project = await manager.findOne(Project, { where: { id: record.projectId } });
      if (!project) throw new NotFoundException('Site labour project not found');
      const wipAccount = await this.accountingService.resolveProjectWipAccount(project.wipAccountId);
      const paymentAccount = await this.accountingService.resolvePaymentAccount(dto.paymentMethod);
      const entry = manager.create(ConstructionLedgerEntry, { projectId: record.projectId, referenceType: 'SITE_LABOR_PAYMENT', referenceId: record.id, debitAccountCode: wipAccount, creditAccountCode: paymentAccount, amount: Number(record.totalPayable), postingDate: record.disbursementDate });
      await manager.save(record);
      await manager.save(entry);
      return { record, ledger: entry };
    });
  }
  findMRNs() { return this.mrns.find({ order: { createdAt: 'DESC' } }); }
  async createMRN(dto: CreateMRNDto) { return this.mrns.save(this.mrns.create({ ...dto, mrnNo: `MRN-${new Date().getFullYear()}-${String((await this.mrns.count()) + 1).padStart(4, '0')}`, status: 'PENDING' })); }
  async approveMRN(id: string) { const mrn = await this.mrns.findOne({ where: { id } }); if (!mrn) throw new NotFoundException('MRN not found'); if (mrn.status !== 'PENDING') throw new UnprocessableEntityException('Only pending MRNs can be approved'); mrn.status = 'APPROVED'; return this.mrns.save(mrn); }
  findWorkOrders() { return this.orders.find({ order: { createdAt: 'DESC' } }); }
  async createWorkOrder(dto: CreateWorkOrderDto) {
    if (!await this.contractors.findOne({ where: { id: dto.contractorId } })) throw new NotFoundException('Contractor not found');
    if (!await this.projects.findOne({ where: { id: dto.projectId } })) throw new NotFoundException('Project not found');
    if (dto.endDate < dto.startDate) throw new UnprocessableEntityException('End date cannot be before start date');
    return this.orders.save(this.orders.create({ ...dto, workOrderNo: `WO-${new Date().getFullYear()}-${String((await this.orders.count()) + 1).padStart(4, '0')}`, status: 'PENDING' }));
  }
  async updateWorkOrder(id: string, dto: UpdateWorkOrderDto) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Work order not found');
    if (dto.contractorId && !await this.contractors.findOne({ where: { id: dto.contractorId } })) throw new NotFoundException('Contractor not found');
    if (dto.projectId && !await this.projects.findOne({ where: { id: dto.projectId } })) throw new NotFoundException('Project not found');
    const startDate = dto.startDate ?? order.startDate;
    const endDate = dto.endDate ?? order.endDate;
    if (endDate < startDate) throw new UnprocessableEntityException('End date cannot be before start date');
    if (dto.status && !['PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(dto.status)) throw new UnprocessableEntityException('Invalid work order status');
    Object.assign(order, dto);
    return this.orders.save(order);
  }
  async deleteWorkOrder(id: string) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Work order not found');
    if (await this.bills.count({ where: { workOrderId: id } })) throw new ConflictException('Work order with RA bills cannot be deleted');
    await this.orders.remove(order);
    return { success: true };
  }
  async approveWorkOrder(id: string) { const order = await this.orders.findOne({ where: { id } }); if (!order) throw new NotFoundException('Work order not found'); order.status = 'APPROVED'; return this.orders.save(order); }
  findRABills() { return this.bills.find({ order: { createdAt: 'DESC' } }); }
  async createRABill(dto: CreateRABillDto) { const order = await this.orders.findOne({ where: { id: dto.workOrderId } }); if (!order) throw new NotFoundException('Work order not found'); if (order.status !== 'APPROVED') throw new UnprocessableEntityException('Only approved work orders can receive RA bills'); if (dto.amount > Number(order.amount)) throw new UnprocessableEntityException('RA bill exceeds work order amount'); if (await this.bills.findOne({ where: { workOrderId: dto.workOrderId, status: 'APPROVED' } })) throw new ConflictException('An approved RA bill already exists for this work order'); return this.bills.save(this.bills.create({ ...dto, projectId: order.projectId, contractorId: order.contractorId, paidAmount: 0, raNo: `RA-${new Date().getFullYear()}-${String((await this.bills.count()) + 1).padStart(4, '0')}`, status: 'SUBMITTED' })); }
  async approveRABill(id: string) { const bill = await this.bills.findOne({ where: { id } }); if (!bill) throw new NotFoundException('RA bill not found'); if (bill.status !== 'SUBMITTED') throw new UnprocessableEntityException('Only submitted RA bills can be approved'); bill.status = 'APPROVED'; return this.bills.save(bill); }
  async postRABill(id: string) { return this.dataSource.transaction(async (manager) => { const bill = await manager.findOne(RABill, { where: { id } }); if (!bill) throw new NotFoundException('RA bill not found'); await this.periodService.ensureOpen(bill.submittedDate); if (bill.status !== 'APPROVED') throw new UnprocessableEntityException('Only approved RA bills can be posted'); if (!bill.projectId) throw new UnprocessableEntityException('Project is required for RA bill posting'); const project = await manager.findOne(Project, { where: { id: bill.projectId } }); if (!project) throw new NotFoundException('RA bill project not found'); const wipAccount = project.wipAccountId ? await this.accountingService.resolveProjectWipAccount(project.wipAccountId) : await this.accountingService.getMappedAccountCode('construction_cost', '1122'); const payable = Number(bill.amount) - Number(bill.retentionAmount); const contractorPayable = await this.accountingService.getMappedAccountCode('contractor_payable', '2110'); const entry = manager.create(ConstructionLedgerEntry, { projectId: bill.projectId, referenceType: 'RA_BILL', referenceId: bill.id, debitAccountCode: wipAccount, creditAccountCode: contractorPayable, amount: payable, postingDate: bill.submittedDate }); bill.status = 'POSTED'; await manager.save(bill); await manager.save(entry); return { bill, ledger: entry }; }); }
  async payRABill(dto: ConstructionPaymentDto) { return this.dataSource.transaction(async (manager) => { const bill = await manager.findOne(RABill, { where: { id: dto.raBillId } }); if (!bill) throw new NotFoundException('RA bill not found'); await this.periodService.ensureOpen(dto.paymentDate); if (bill.status !== 'POSTED' && bill.status !== 'PARTIAL') throw new UnprocessableEntityException('Only posted RA bills can be paid'); const payable = Number(bill.amount) - Number(bill.retentionAmount); const due = payable - Number(bill.paidAmount); if (dto.amount > due) throw new UnprocessableEntityException('Payment exceeds contractor payable'); bill.paidAmount = Number(bill.paidAmount) + dto.amount; bill.status = bill.paidAmount === payable ? 'PAID' : 'PARTIAL'; const contractorPayable = await this.accountingService.getMappedAccountCode('contractor_payable', '2110'); const paymentAccount = await this.accountingService.resolvePaymentAccount(dto.paymentMethod, dto.accountCode); const entry = manager.create(ConstructionLedgerEntry, { projectId: bill.projectId ?? null, referenceType: 'RA_PAYMENT', referenceId: bill.id, debitAccountCode: contractorPayable, creditAccountCode: paymentAccount, amount: dto.amount, postingDate: dto.paymentDate }); await manager.save(bill); await manager.save(entry); return { bill, ledger: entry }; }); }

  async getDashboard() {
    const [contractors, mrns, raBills, equipment, labor] = await Promise.all([
      this.contractors.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.mrns.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.bills.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.equipment.find(),
      this.labor.find({ order: { date: 'DESC' }, take: 5 }),
    ]);

    const pendingMRNs = mrns.filter((mrn) => mrn.status === 'PENDING').length;
    const pendingRABills = raBills.filter((bill) => bill.status === 'SUBMITTED').length;
    const activeLabor = labor.filter((record) => record.status === 'APPROVED' || record.status === 'PAID').length;

    return {
      stats: {
        activeContractors: contractors.filter((c) => c.status === 'ACTIVE').length,
        pendingMRNs,
        pendingRABills,
        totalEquipment: equipment.length,
        activeLaborRecords: activeLabor,
      },
      recentMRNs: mrns.slice(0, 5).map((mrn) => ({
        id: mrn.mrnNo,
        project: mrn.projectId,
        status: mrn.status,
        date: mrn.createdAt,
      })),
      recentRABills: raBills.slice(0, 5).map((bill) => ({
        id: bill.raNo,
        project: bill.projectId,
        contractor: bill.contractorId,
        amount: Number(bill.amount),
        status: bill.status,
        date: bill.submittedDate || bill.createdAt,
      })),
    };
  }

}