import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Investor } from './entities/investor.entity';
import { InvestorAllocation } from './entities/investor-allocation.entity';
import { InvestorPayout } from './entities/investor-payout.entity';
import { ConstructionLedgerEntry } from '../construction/entities/construction-ledger.entity';
import { AccountingPeriodService } from '../accounting/period.service';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class InvestorsService {
  constructor(
    @InjectRepository(Investor) private readonly investors: Repository<Investor>,
    @InjectRepository(InvestorAllocation) private readonly allocations: Repository<InvestorAllocation>,
    @InjectRepository(InvestorPayout) private readonly payouts: Repository<InvestorPayout>,
    @InjectRepository(ConstructionLedgerEntry) private readonly ledger: Repository<ConstructionLedgerEntry>,
    private readonly dataSource: DataSource,
    private readonly periodService: AccountingPeriodService,
    private readonly accountingService: AccountingService,
  ) {}

  listInvestors() { return this.investors.find({ order: { createdAt: 'DESC' } }); }

  async createInvestor(dto: Partial<Investor>) {
    if (!dto.name || !dto.type || !dto.contact || !dto.email) throw new UnprocessableEntityException('Name, type, contact and email are required');
    return this.investors.save(this.investors.create({ ...dto, status: dto.status ?? 'ACTIVE', joined: dto.joined ?? new Date().toISOString().slice(0, 10) }));
  }

  async updateInvestor(id: string, dto: Partial<Investor>) {
    const investor = await this.investors.findOne({ where: { id } });
    if (!investor) throw new NotFoundException('Investor not found');
    Object.assign(investor, dto);
    return this.investors.save(investor);
  }

  async listAllocations() {
    const allocations = await this.allocations.find({ order: { createdAt: 'DESC' } });
    const investors = new Map((await this.listInvestors()).map((item) => [item.id, item.name]));
    return allocations.map((item) => ({ ...item, investor: investors.get(item.investorId) ?? item.investorId, profit: Number(item.currentValue) - Number(item.investment) }));
  }

  async createAllocation(dto: Partial<InvestorAllocation>) {
    const investor = await this.investors.findOne({ where: { id: dto.investorId } });
    if (!investor) throw new NotFoundException('Investor not found');
    const equity = Number(dto.equityPercent);
    const investment = Number(dto.investment);
    if (!dto.project || !Number.isFinite(equity) || equity <= 0 || equity > 100 || !Number.isFinite(investment) || investment <= 0) {
      throw new UnprocessableEntityException('Project, valid equity percentage and positive investment are required');
    }

    return this.allocations.save(this.allocations.create({ ...dto, equityPercent: equity, investment, currentValue: Number(dto.currentValue ?? investment), status: 'ACTIVE' }));
  }

  async receiveInvestment(id: string, dto: { amount?: number; paymentMethod: string; paymentDate?: string; referenceNumber: string }) {
    return this.dataSource.transaction(async (manager) => {
      const allocation = await manager.findOne(InvestorAllocation, { where: { id } });
      if (!allocation) throw new NotFoundException('Investor allocation not found');
      const amount = Number(dto.amount ?? allocation.investment);
      if (!Number.isFinite(amount) || amount <= 0 || amount > Number(allocation.investment)) {
        throw new UnprocessableEntityException('Investment receipt must be positive and cannot exceed the allocation');
      }
      if (!dto.paymentMethod || !dto.referenceNumber) {
        throw new UnprocessableEntityException('Payment method and reference number are required');
      }
      const existing = await manager.findOne(ConstructionLedgerEntry, {
        where: { referenceType: 'INVESTOR_CAPITAL', referenceId: allocation.id },
      });
      if (existing) throw new ConflictException('Investment receipt is already posted');
      const paymentDate = dto.paymentDate ?? new Date().toISOString().slice(0, 10);
      await this.periodService.ensureOpen(paymentDate);
      const paymentAccount = await this.accountingService.resolvePaymentAccount(dto.paymentMethod);
      const capitalAccount = await this.accountingService.getMappedAccountCode('investor_capital', '3103');
      const entry = manager.create(ConstructionLedgerEntry, {
        referenceType: 'INVESTOR_CAPITAL',
        referenceId: allocation.id,
        projectId: null,
        debitAccountCode: paymentAccount,
        creditAccountCode: capitalAccount,
        amount,
        postingDate: paymentDate,
      });
      return { allocation, ledger: await manager.save(entry) };
    });
  }

  async listPayouts() {
    const payouts = await this.payouts.find({ order: { scheduledDate: 'DESC' } });
    const investors = new Map((await this.listInvestors()).map((item) => [item.id, item.name]));
    return payouts.map((item) => ({ ...item, investor: investors.get(item.investorId) ?? item.investorId }));
  }

  async createPayout(dto: Partial<InvestorPayout>) {
    const investor = await this.investors.findOne({ where: { id: dto.investorId } });
    if (!investor) throw new NotFoundException('Investor not found');
    const amount = Number(dto.amount);
    if (!dto.project || !dto.type || !dto.scheduledDate || !Number.isFinite(amount) || amount <= 0) throw new UnprocessableEntityException('Investor, project, type, date and positive amount are required');
    const payoutNo = `IP-${new Date().getFullYear()}-${String((await this.payouts.count()) + 1).padStart(4, '0')}`;
    return this.payouts.save(this.payouts.create({ ...dto, payoutNo, amount, status: 'SCHEDULED' }));
  }

  async processPayout(id: string, dto: { paidDate?: string; paymentMethod: string; referenceNumber: string }) {
    const payout = await this.payouts.findOne({ where: { id } });
    if (!payout) throw new NotFoundException('Payout not found');
    if (payout.status === 'PAID') throw new ConflictException('Payout is already paid');
    if (!dto.paymentMethod || !dto.referenceNumber) throw new UnprocessableEntityException('Payment method and reference number are required');
    payout.status = 'PAID';
    payout.paidDate = dto.paidDate ?? new Date().toISOString().slice(0, 10);
    await this.periodService.ensureOpen(payout.paidDate);
    payout.paymentMethod = dto.paymentMethod;
    payout.referenceNumber = dto.referenceNumber;
    const saved = await this.payouts.save(payout);
    const payoutExpense = await this.accountingService.getMappedAccountCode('investor_payout_expense', '5200');
    const paymentAccount = await this.accountingService.resolvePaymentAccount(dto.paymentMethod);
    const entry = await this.ledger.save(this.ledger.create({
      referenceType: 'INVESTOR_PAYOUT',
      referenceId: payout.id,
      debitAccountCode: payoutExpense,
      creditAccountCode: paymentAccount,
      amount: Number(payout.amount),
      postingDate: payout.paidDate,
    }));
    return { payout: saved, ledger: entry };
  }

  async getDashboard() {
    const [investors, allocations, payouts] = await Promise.all([
      this.investors.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.allocations.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.payouts.find({ order: { scheduledDate: 'DESC' }, take: 5 }),
    ]);

    const investorMap = new Map(investors.map((item) => [item.id, item.name]));

    return {
      stats: {
        totalInvestors: investors.length,
        activeInvestors: investors.filter((i) => i.status === 'ACTIVE').length,
        totalEquity: allocations.reduce((sum, a) => sum + Number(a.equityPercent || 0), 0),
        pendingPayouts: payouts.filter((p) => p.status === 'SCHEDULED').length,
        totalPayouts: payouts.reduce((sum, p) => sum + Number(p.amount || 0), 0),
      },
      recentAllocations: allocations.slice(0, 5).map((allocation) => ({
        ...allocation,
        investor: investorMap.get(allocation.investorId) ?? allocation.investorId,
        profit: Number(allocation.currentValue) - Number(allocation.investment),
      })),
      recentPayouts: payouts.slice(0, 5).map((payout) => ({
        ...payout,
        investor: investorMap.get(payout.investorId) ?? payout.investorId,
      })),
    };
  }

}