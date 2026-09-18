import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { AccountingPeriod } from './entities/accounting-period.entity';
import { PayrollRun } from '../hr/entities/hr-workflow.entity';
import { PayrollLedgerEntry } from '../hr/entities/payroll-ledger.entity';
import { VendorBill } from '../procurement/entities/vendor-bill.entity';
import { PayableLedgerEntry } from '../procurement/entities/payable-ledger.entity';
import { RABill } from '../construction/entities/construction-workflow.entity';
import { ConstructionLedgerEntry } from '../construction/entities/construction-ledger.entity';
import { LedgerEntry } from '../sales/entities/ledger-entry.entity';

@Injectable()
export class AccountingPeriodService {
  constructor(
    @InjectRepository(AccountingPeriod) private readonly repository: Repository<AccountingPeriod>,
    @InjectRepository(PayrollRun) private readonly payrollRepository: Repository<PayrollRun>,
    @InjectRepository(VendorBill) private readonly vendorBillRepository: Repository<VendorBill>,
    @InjectRepository(RABill) private readonly raBillRepository: Repository<RABill>,
    @InjectRepository(PayrollLedgerEntry) private readonly payrollLedgerRepository: Repository<PayrollLedgerEntry>,
    @InjectRepository(LedgerEntry) private readonly salesLedgerRepository: Repository<LedgerEntry>,
    @InjectRepository(PayableLedgerEntry) private readonly payableLedgerRepository: Repository<PayableLedgerEntry>,
    @InjectRepository(ConstructionLedgerEntry) private readonly constructionLedgerRepository: Repository<ConstructionLedgerEntry>,
  ) {}

  list() {
    return this.repository.find({ order: { periodStart: 'DESC' } });
  }

  async close(periodStart: string, periodEnd: string, userId: string, reason?: string) {
    if (!this.isValidDate(periodStart) || !this.isValidDate(periodEnd) || periodEnd < periodStart) {
      throw new UnprocessableEntityException('Period dates must be valid and period end cannot be before period start');
    }
    const overlap = await this.repository
      .createQueryBuilder('period')
      .where('period."periodStart" <= :periodEnd', { periodEnd })
      .andWhere('period."periodEnd" >= :periodStart', { periodStart })
      .getOne();
    if (overlap && (overlap.periodStart !== periodStart || overlap.periodEnd !== periodEnd)) {
      throw new ConflictException('Accounting period overlaps an existing period');
    }
    const validation = await this.validateClose(periodStart, periodEnd);
    if (!validation.canClose) {
      throw new ConflictException(`Period cannot be closed: ${validation.errors.join('; ')}`);
    }
    const existing = await this.repository.findOne({ where: { periodStart, periodEnd } });
    if (existing?.isClosed) throw new ConflictException('Accounting period is already closed');
    const period = existing ?? this.repository.create({ periodStart, periodEnd });
    period.isClosed = true;
    period.closedBy = userId;
    period.closedAt = new Date();
    period.reason = reason;
    return this.repository.save(period);
  }

  async validateClose(periodStart: string, periodEnd: string) {
    if (!this.isValidDate(periodStart) || !this.isValidDate(periodEnd) || periodEnd < periodStart) {
      throw new UnprocessableEntityException('Period dates must be valid and period end cannot be before period start');
    }
    const dateRange = Between(periodStart, periodEnd);
    const [pendingPayroll, pendingBills, pendingRABills] = await Promise.all([
      this.payrollRepository.count({ where: { status: In(['DRAFT', 'APPROVED']), createdAt: Between(new Date(`${periodStart}T00:00:00Z`), new Date(`${periodEnd}T23:59:59Z`)) } }),
      this.vendorBillRepository.count({ where: { status: In(['PENDING', 'APPROVED']), issueDate: dateRange } }),
      this.raBillRepository.count({ where: { status: In(['SUBMITTED', 'APPROVED']), submittedDate: dateRange } }),
    ]);
    const debitTotal = await this.sumLedgerSide(periodStart, periodEnd);
    const creditTotal = await this.sumLedgerSide(periodStart, periodEnd);
    const errors: string[] = [];
    if (pendingPayroll) errors.push(`${pendingPayroll} payroll run(s) are not posted`);
    if (pendingBills) errors.push(`${pendingBills} vendor bill(s) are not posted`);
    if (pendingRABills) errors.push(`${pendingRABills} RA bill(s) are not posted`);
    if (Math.abs(debitTotal - creditTotal) > 0.005) errors.push(`ledger is unbalanced by ${(debitTotal - creditTotal).toFixed(2)}`);
    return {
      canClose: errors.length === 0,
      periodStart,
      periodEnd,
      pendingPayroll,
      pendingBills,
      pendingRABills,
      debitTotal,
      creditTotal,
      ledgerBalanced: Math.abs(debitTotal - creditTotal) <= 0.005,
      errors,
    };
  }

  private async sumLedgerSide(periodStart: string, periodEnd: string) {
    const repositories = [
      this.payrollLedgerRepository,
      this.salesLedgerRepository,
      this.payableLedgerRepository,
      this.constructionLedgerRepository,
    ];
    const totals = await Promise.all(repositories.map((repository) =>
      repository.createQueryBuilder('entry')
        .select('COALESCE(SUM(entry.amount), 0)', 'total')
        .where('entry."postingDate" BETWEEN :start AND :end', { start: periodStart, end: periodEnd })
        .getRawOne<{ total: string }>(),
    ));
    return totals.reduce((sum, result) => sum + Number(result?.total ?? 0), 0);
  }

  async reopen(id: string) {
    const period = await this.repository.findOne({ where: { id } });
    if (!period) throw new NotFoundException('Accounting period not found');
    period.isClosed = false;
    period.closedBy = undefined;
    period.closedAt = undefined;
    return this.repository.save(period);
  }

  async ensureOpen(postingDate: string) {
    if (!this.isValidDate(postingDate)) throw new UnprocessableEntityException('Posting date must be a valid date');
    const closed = await this.repository
      .createQueryBuilder('period')
      .where('period."isClosed" = true')
      .andWhere('period."periodStart" <= :postingDate', { postingDate })
      .andWhere('period."periodEnd" >= :postingDate', { postingDate })
      .getOne();
    if (closed) throw new ConflictException(`Accounting period ${closed.periodStart} to ${closed.periodEnd} is closed`);
  }

  private isValidDate(value: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  }
}
