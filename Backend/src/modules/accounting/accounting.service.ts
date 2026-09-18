import { BadRequestException, ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Account, AccountStatus, AccountType } from './entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { AccountQueryDto } from './dtos/account-query.dto';
import { PayrollLedgerEntry } from '../hr/entities/payroll-ledger.entity';
import { LedgerEntry } from '../sales/entities/ledger-entry.entity';
import { PayableLedgerEntry } from '../procurement/entities/payable-ledger.entity';
import { ConstructionLedgerEntry } from '../construction/entities/construction-ledger.entity';
import { BankReconciliationTransaction } from './entities/bank-reconciliation.entity';
import { AccountingPeriodService } from './period.service';
import { AuditService } from '../audit/audit.service';
import { Project } from '../projects/entities/project.entity';
import { AccountMapping } from './entities/account-mapping.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(AccountMapping)
    private readonly mappingsRepository: Repository<AccountMapping>,
    @InjectRepository(PayrollLedgerEntry)
    private readonly payrollLedgerRepository: Repository<PayrollLedgerEntry>,
    @InjectRepository(LedgerEntry)
    private readonly salesLedgerRepository: Repository<LedgerEntry>,
    @InjectRepository(PayableLedgerEntry)
    private readonly payableLedgerRepository: Repository<PayableLedgerEntry>,
    @InjectRepository(ConstructionLedgerEntry)
    private readonly constructionLedgerRepository: Repository<ConstructionLedgerEntry>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(BankReconciliationTransaction)
    private readonly reconciliationRepository: Repository<BankReconciliationTransaction>,
    private readonly periodService: AccountingPeriodService,
    private readonly auditService: AuditService,
  ) {}

  private readonly defaultMappings = [
    ['customer_receipt_cash', '1111', 'Cash in Hand - Head Office', 'SALES'],
    ['customer_receipt_bank', '1114', 'Bank Account - Head Office / Project', 'SALES'],
    ['customer_receipt_cheque', '1115', 'Cheques in Transit', 'SALES'],
    ['customer_receivable', '1131', 'Receivable from Flat Buyers', 'SALES'],
    ['customer_advance', '2111', 'Advance Booking & Installments', 'SALES'],
    ['flat_sales_revenue', '4101', 'Revenue from Flat Sales', 'SALES'],
    ['parking_sales_revenue', '4102', 'Revenue from Parking Sales', 'SALES'],
    ['vendor_payable', '2121', 'Accounts Payable - Suppliers', 'PROCUREMENT'],
    ['vendor_expense', '1122', 'WIP - Construction Materials', 'PROCUREMENT'],
    ['salary_expense', '5212', 'Staff Salaries & Allowances', 'PAYROLL'],
    ['salary_payable', '2133', 'Salary Payable', 'PAYROLL'],
    ['payroll_deduction_payable', '2132', 'VAT / TDS Payable', 'PAYROLL'],
    ['investor_capital', '3103', 'Investor Capital', 'INVESTORS'],
    ['investor_payable', '2223', 'Investor Payable', 'INVESTORS'],
    ['investor_payout_expense', '5231', 'Investor Distribution Expense', 'INVESTORS'],
    ['construction_cost', '1122', 'WIP - Construction Materials', 'CONSTRUCTION'],
    ['utility_expense', '1124', 'WIP - Legal & Utility Fees', 'PROJECTS'],
    ['contractor_payable', '2122', 'Accounts Payable - Subcontractors', 'CONSTRUCTION'],
    ['site_labor_expense', '1123', 'WIP - Labour & Subcontractor', 'CONSTRUCTION'],
  ] as const;

  async getAccountMappings() {
    const existing = await this.mappingsRepository.find({ order: { module: 'ASC', mappingKey: 'ASC' } });
    const byKey = new Map(existing.map((item) => [item.mappingKey, item]));
    const missing = this.defaultMappings
      .filter(([mappingKey]) => !byKey.has(mappingKey))
      .map(([mappingKey, accountCode, label, module]) => this.mappingsRepository.create({ mappingKey, accountCode, label, module }));
    if (missing.length) await this.mappingsRepository.save(missing);
    const mappings = await this.mappingsRepository.find({ order: { module: 'ASC', mappingKey: 'ASC' } });
    return mappings.map((mapping) => ({
      ...mapping,
      expectedAccountType: this.getMappingAccountType(mapping.mappingKey),
    }));
  }

  async createManualVoucher(dto: {
    voucherType: 'DEBIT' | 'CREDIT' | 'JOURNAL' | 'CONTRA';
    postingDate: string;
    debitAccountCode: string;
    creditAccountCode: string;
    amount: number;
    projectId?: string;
    referenceNo?: string;
    description: string;
  }) {
    const amount = Number(dto.amount);
    if (!dto.postingDate || !Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Posting date and a positive amount are required');
    }
    if (dto.debitAccountCode === dto.creditAccountCode) {
      throw new BadRequestException('Debit and credit accounts must be different');
    }
    const [debitAccount, creditAccount] = await Promise.all([
      this.accountsRepository.findOne({ where: { code: dto.debitAccountCode, status: AccountStatus.ACTIVE } }),
      this.accountsRepository.findOne({ where: { code: dto.creditAccountCode, status: AccountStatus.ACTIVE } }),
    ]);
    if (!debitAccount || !creditAccount) throw new BadRequestException('Select two active accounts');
    if (!debitAccount.isPostable || !creditAccount.isPostable) {
      throw new BadRequestException('Header accounts cannot receive postings');
    }
    if (dto.projectId) {
      const project = await this.projectsRepository.findOne({ where: { id: dto.projectId } });
      if (!project) throw new BadRequestException('Selected project was not found');
    }
    await this.periodService.ensureOpen(dto.postingDate);
    const entry = this.salesLedgerRepository.create({
      referenceType: `MANUAL_${dto.voucherType}`,
      referenceId: randomUUID(),
      projectId: dto.projectId || null,
      debitAccountCode: debitAccount.code,
      creditAccountCode: creditAccount.code,
      amount,
      postingDate: dto.postingDate,
      description: dto.description.trim(),
      status: 'PENDING_APPROVAL',
      rejectionReason: null,
      approvedBy: null,
      approvedAt: null,
    });
    return this.salesLedgerRepository.save(entry);
  }

  async approveManualVoucher(id: string, actorEmail?: string) {
    const entry = await this.salesLedgerRepository.findOne({ where: { id } });
    if (!entry || !entry.referenceType.startsWith('MANUAL_')) throw new NotFoundException('Manual voucher not found');
    if (entry.status !== 'PENDING_APPROVAL') throw new UnprocessableEntityException('Only pending vouchers can be approved');
    await this.periodService.ensureOpen(entry.postingDate);
    entry.status = 'APPROVED';
    entry.approvedBy = actorEmail ?? 'System';
    entry.approvedAt = new Date();
    return this.salesLedgerRepository.save(entry);
  }

  async rejectManualVoucher(id: string, reason: string) {
    const entry = await this.salesLedgerRepository.findOne({ where: { id } });
    if (!entry || !entry.referenceType.startsWith('MANUAL_')) throw new NotFoundException('Manual voucher not found');
    if (entry.status !== 'PENDING_APPROVAL') throw new UnprocessableEntityException('Only pending vouchers can be rejected');
    if (!reason?.trim()) throw new BadRequestException('Rejection reason is required');
    entry.status = 'REJECTED';
    entry.rejectionReason = reason.trim();
    return this.salesLedgerRepository.save(entry);
  }

  async reverseManualVoucher(id: string) {
    const entry = await this.salesLedgerRepository.findOne({ where: { id } });
    if (!entry || !entry.referenceType.startsWith('MANUAL_')) throw new NotFoundException('Manual voucher not found');
    if (entry.status !== 'APPROVED') throw new UnprocessableEntityException('Only approved vouchers can be reversed');
    await this.periodService.ensureOpen(new Date().toISOString().slice(0, 10));
    entry.status = 'REVERSED';
    await this.salesLedgerRepository.save(entry);
    const reversal = this.salesLedgerRepository.create({
      referenceType: 'MANUAL_REVERSAL',
      referenceId: entry.id,
      projectId: entry.projectId,
      debitAccountCode: entry.creditAccountCode,
      creditAccountCode: entry.debitAccountCode,
      amount: entry.amount,
      postingDate: new Date().toISOString().slice(0, 10),
      description: `Reversal of ${entry.referenceId}`,
      status: 'APPROVED',
      rejectionReason: null,
      approvedBy: 'System',
      approvedAt: new Date(),
    });
    return this.salesLedgerRepository.save(reversal);
  }

  async getMappedAccountCode(mappingKey: string, fallback: string) {
    const mapping = (await this.getAccountMappings()).find((item) => item.mappingKey === mappingKey);
    return mapping?.accountCode ?? fallback;
  }

  async resolvePaymentAccount(paymentMethod: string, requestedCode?: string) {
    const normalized = paymentMethod.trim().toLowerCase();
    const mappingKey = normalized.includes('cheque') ? 'customer_receipt_cheque'
      : normalized.includes('cash') ? 'customer_receipt_cash' : 'customer_receipt_bank';
    const mappedCode = await this.getMappedAccountCode(mappingKey, mappingKey.endsWith('cash') ? '1101' : '1100');
    const candidates = [requestedCode?.trim(), mappedCode, mappingKey.endsWith('cash') ? '1101' : '1100'].filter(Boolean) as string[];
    let account: Account | null = null;
    for (const candidate of candidates) {
      account = await this.accountsRepository.findOne({ where: { code: candidate, status: AccountStatus.ACTIVE } });
      if (account) break;
    }

    if (!account || account.type !== AccountType.ASSET || !account.isPostable) {
      throw new UnprocessableEntityException(`Payment account ${requestedCode ?? mappedCode} is not an active postable asset account`);
    }
    return account.code;
  }

  async resolveProjectWipAccount(projectWipAccountId?: string | null) {
    if (!projectWipAccountId) {
      throw new UnprocessableEntityException('Project WIP account is not configured');
    }
    const account = await this.accountsRepository.findOne({
      where: { id: projectWipAccountId, status: AccountStatus.ACTIVE },
    });
    if (!account || account.type !== AccountType.ASSET || account.isHeader || !account.isPostable) {
      throw new UnprocessableEntityException('Project WIP account must be an active postable asset account');
    }
    return account.code;
  }

  async updateAccountMapping(mappingKey: string, accountCode: string) {
    const account = await this.accountsRepository.findOne({ where: { code: accountCode, status: AccountStatus.ACTIVE } });
    const expectedType = this.getMappingAccountType(mappingKey);
    if (!account || account.type !== expectedType || !account.isPostable) {
      throw new UnprocessableEntityException(`Mapping ${mappingKey} must point to an active postable ${expectedType.toLowerCase()} account`);
    }
    const mapping = await this.mappingsRepository.findOne({ where: { mappingKey } });
    if (!mapping) throw new NotFoundException(`Account mapping ${mappingKey} not found`);
    mapping.accountCode = accountCode;
    return this.mappingsRepository.save(mapping);
  }

  private getMappingAccountType(mappingKey: string): AccountType {
    if (mappingKey.includes('receipt_') || mappingKey === 'customer_receivable') return AccountType.ASSET;
    if (mappingKey === 'customer_advance') return AccountType.LIABILITY;
    if (mappingKey === 'flat_sales_revenue' || mappingKey === 'parking_sales_revenue') return AccountType.REVENUE;
    if (['vendor_expense', 'construction_cost', 'utility_expense', 'site_labor_expense'].includes(mappingKey)) return AccountType.ASSET;
    if (mappingKey.includes('payable')) return AccountType.LIABILITY;
    if (mappingKey === 'investor_capital') return AccountType.EQUITY;
    return AccountType.EXPENSE;
  }

  async findAccounts(query: AccountQueryDto): Promise<Account[]> {
    const status = query.status ?? AccountStatus.ACTIVE;
    const accounts = await this.accountsRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.children', 'children')
      .where('1 = 1')
      .andWhere(query.type ? 'account.type = :type' : '1 = 1', { type: query.type })
      .andWhere('account.status = :status', { status })
      .andWhere(
        query.search
          ? new Brackets((qb) =>
              qb.where('account.code ILIKE :search', { search: `%${query.search}%` }).orWhere('account.name ILIKE :search', {
                search: `%${query.search}%`,
              }),
            )
          : '1 = 1',
      )
      .orderBy('account.code', 'ASC')
      .getMany();

    const accountsWithOwnBalances = await Promise.all(
      accounts.map(async (account) => ({
        ...account,
        balance: (await this.getBalance(account.id)).balance,
      })),
    );

    const balanceById = new Map(accountsWithOwnBalances.map((account) => [account.id, account.balance]));
    for (const account of accountsWithOwnBalances) {
      let parentId = account.parentId;
      while (parentId) {
        balanceById.set(parentId, (balanceById.get(parentId) ?? 0) + account.balance);
        const parent = accounts.find((candidate) => candidate.id === parentId);
        parentId = parent?.parentId ?? null;
      }
    }

    const accountsWithBalances = accountsWithOwnBalances.map((account) => ({
      ...account,
      balance: balanceById.get(account.id) ?? account.balance,
    }));

    return this.toTree(accountsWithBalances);
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async create(dto: CreateAccountDto): Promise<Account> {
    await this.assertCodeAvailable(dto.code);
    const parent = await this.resolveParent(dto.parentId, dto.type);
    this.assertAccountShape(dto);

    const account = this.accountsRepository.create({
      ...dto,
      openingBalance: String(dto.openingBalance ?? 0),
      parent,
      parentId: parent?.id ?? null,
      status: AccountStatus.ACTIVE,
    });
    return this.accountsRepository.save(account);
  }

  async update(id: string, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(id);
    if (dto.code && dto.code !== account.code) {
      await this.assertCodeAvailable(dto.code, id);
    }
    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new UnprocessableEntityException('An account cannot be its own parent');
      }
      const parent = await this.resolveParent(dto.parentId, dto.type ?? account.type);
      account.parent = parent;
      account.parentId = parent?.id ?? null;
    }
    this.assertAccountShape({
      isHeader: dto.isHeader ?? account.isHeader,
      isPostable: dto.isPostable ?? account.isPostable,
    });
    Object.assign(account, dto);
    if (dto.openingBalance !== undefined) {
      account.openingBalance = String(dto.openingBalance);
    }
    return this.accountsRepository.save(account);
  }

  async setStatus(id: string, status: AccountStatus): Promise<Account> {
    const account = await this.findOne(id);
    if (status === AccountStatus.INACTIVE) {
      const childCount = await this.accountsRepository.count({ where: { parentId: id, status: AccountStatus.ACTIVE } });
      if (childCount > 0) {
        throw new ConflictException('Move or deactivate active child accounts before deactivating this account');
      }
    }
    account.status = status;
    return this.accountsRepository.save(account);
  }

  async getBalance(id: string) {
    const account = await this.findOne(id);
    const entries = await this.getLedgerEntries({ account: account.code });
    const debit = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const credit = entries.reduce((sum, entry) => sum + entry.credit, 0);
    const debitNormal = account.type === 'ASSET' || account.type === 'EXPENSE';
    return {
      accountId: account.id,
      code: account.code,
      name: account.name,
      openingBalance: Number(account.openingBalance),
      debit,
      credit,
      balance: Number(account.openingBalance) + (debitNormal ? debit - credit : credit - debit),
      source: 'opening_balance_and_postings',
    };
  }

  async getSummary() {
    const accounts = await this.accountsRepository.find({ where: { status: AccountStatus.ACTIVE } });
    const entries = await this.getLedgerEntries({});
    return accounts.reduce<Record<string, number>>((summary, account) => {
      const posted = entries.filter((entry) => entry.debitAccountCode === account.code || entry.creditAccountCode === account.code);
      const debit = posted.filter((entry) => entry.debitAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
      const credit = posted.filter((entry) => entry.creditAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
      const debitNormal = account.type === 'ASSET' || account.type === 'EXPENSE';
      summary[account.type] = (summary[account.type] ?? 0) + Number(account.openingBalance) + (debitNormal ? debit - credit : credit - debit);
      return summary;
    }, {});
  }

  async getGeneralLedger(query: { account?: string; fromDate?: string; toDate?: string; projectId?: string }) {
    const accountCode = query.account;
    const account = accountCode ? await this.findAccountByCode(accountCode) : undefined;
    if (accountCode && !account) throw new NotFoundException(`Account with code ${accountCode} not found`);
    const allEntries = await this.getLedgerEntries({ account: accountCode, toDate: query.toDate, projectId: query.projectId });
    const priorEntries = query.fromDate
      ? allEntries.filter((entry) => entry.postingDate < query.fromDate!)
      : [];
    const entries = query.fromDate
      ? allEntries.filter((entry) => entry.postingDate >= query.fromDate!)
      : allEntries;
    const accountType = account?.type;
    const debitNormal = accountType === 'ASSET' || accountType === 'EXPENSE';
    const openingBalance = Number(account?.openingBalance ?? 0) + priorEntries.reduce(
      (balance, entry) => balance + (debitNormal ? entry.debit - entry.credit : entry.credit - entry.debit),
      0,
    );
    let runningBalance = openingBalance;
    return entries
      .sort((a, b) => a.postingDate.localeCompare(b.postingDate) || a.createdAt.localeCompare(b.createdAt))
      .map((entry) => {
        runningBalance += debitNormal ? entry.debit - entry.credit : entry.credit - entry.debit;
        return {
          id: entry.id,
          date: entry.postingDate,
          voucherNo: `${entry.referenceType}-${entry.referenceId.slice(0, 8)}`,
          voucherType: entry.debitAccountCode === entry.creditAccountCode ? 'JOURNAL' : 'JOURNAL',
          particulars: ('description' in entry && entry.description) || `${entry.referenceType} posting`,
          debit: accountCode && entry.debitAccountCode === accountCode ? entry.amount : 0,
          credit: accountCode && entry.creditAccountCode === accountCode ? entry.amount : 0,
          runningBalance,
          openingBalance,
          referenceType: entry.referenceType,
          referenceId: entry.referenceId,
          accountCode,
          accountType,
          normalBalance: debitNormal ? 'DEBIT' : 'CREDIT',
          projectId: entry.projectId,
          projectName: entry.projectName,
        };
      })
      .map((entry, index, currentEntries) => ({
        ...entry,
        closingBalance: index === currentEntries.length - 1 ? entry.runningBalance : undefined,
      }));
  }

  async getVouchers(query: { fromDate?: string; toDate?: string; type?: string }) {
    const entries = await this.getLedgerEntries(query);
    const manualEntries = await this.salesLedgerRepository.find({
      where: [{ referenceType: 'MANUAL_JOURNAL' as any }, { referenceType: 'MANUAL_DEBIT' as any }, { referenceType: 'MANUAL_CREDIT' as any }, { referenceType: 'MANUAL_CONTRA' as any }],
    });
    const allEntries = [...entries, ...manualEntries
      .filter((entry) => !entries.some((item) => item.id === entry.id))
      .filter((entry) => !query.fromDate || entry.postingDate >= query.fromDate)
      .filter((entry) => !query.toDate || entry.postingDate <= query.toDate)
      .map((entry) => ({ ...entry, amount: Number(entry.amount), projectName: null, particulars: entry.description || `${entry.referenceType} posting` }))];
    return allEntries.map((entry) => ({
      id: entry.id,
      voucherNo: `${entry.referenceType}-${entry.referenceId.slice(0, 8)}`,
      voucherType: entry.referenceType === 'MANUAL_DEBIT' ? 'DEBIT'
        : entry.referenceType === 'MANUAL_CREDIT' ? 'CREDIT'
          : entry.referenceType === 'MANUAL_CONTRA' ? 'CONTRA' : 'JOURNAL',
      accountHead: `${entry.debitAccountCode} / ${entry.creditAccountCode}`,
      particulars: entry.particulars || `${entry.referenceType} posting`,
      amount: entry.amount,
      entryDate: entry.postingDate,
      preparedBy: 'System',
      status: 'status' in entry ? entry.status : 'APPROVED',
      rejectionReason: 'rejectionReason' in entry ? entry.rejectionReason : null,
      approvedBy: 'approvedBy' in entry ? entry.approvedBy : null,
      referenceType: entry.referenceType,
      referenceId: entry.referenceId,
    }));
  }

  async getTrialBalance(query: { fromDate?: string; toDate?: string }) {
    const [accounts, entries] = await Promise.all([
      this.accountsRepository.find({ where: { status: AccountStatus.ACTIVE }, order: { code: 'ASC' } }),
      this.getLedgerEntries(query),
    ]);
    return {
      fromDate: query.fromDate,
      toDate: query.toDate,
      accounts: accounts.filter((account) => !account.isHeader).map((account) => {
        const debit = entries.filter((entry) => entry.debitAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
        const credit = entries.filter((entry) => entry.creditAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
        return {
          id: account.id,
          accountCode: account.code,
          accountName: account.name,
          accountType: account.type === 'REVENUE' ? 'INCOME' : account.type,
          debitBalance: debit,
          creditBalance: credit,
        };
      }),
    };
  }

  async getProfitLoss(query: { fromDate?: string; toDate?: string }) {
    const [accounts, entries] = await Promise.all([
      this.accountsRepository.find({ where: { status: AccountStatus.ACTIVE }, order: { code: 'ASC' } }),
      this.getLedgerEntries(query),
    ]);
    const items = accounts.filter((account) => account.type === 'REVENUE' || account.type === 'EXPENSE').map((account) => {
      const debit = entries.filter((entry) => entry.debitAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
      const credit = entries.filter((entry) => entry.creditAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
      return {
        id: account.id,
        itemName: account.name,
        category: account.type === 'REVENUE' ? 'Operating Income' : 'Operating Expenses',
        currentAmount: account.type === 'REVENUE' ? credit - debit : debit - credit,
        previousAmount: 0,
        budgetAmount: 0,
        categoryType: account.type === 'REVENUE' ? 'INCOME' : 'EXPENSE',
      };
    });
    return { fromDate: query.fromDate, toDate: query.toDate, items };
  }

  async getBalanceSheet(query: { asOfDate?: string }) {
    const [accounts, entries] = await Promise.all([
      this.accountsRepository.find({ where: { status: AccountStatus.ACTIVE }, order: { code: 'ASC' } }),
      this.getLedgerEntries({ toDate: query.asOfDate }),
    ]);
    const items = accounts.filter((account) => ['ASSET', 'LIABILITY', 'EQUITY'].includes(account.type) && !account.isHeader).map((account) => {
      const debit = entries.filter((entry) => entry.debitAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
      const credit = entries.filter((entry) => entry.creditAccountCode === account.code).reduce((sum, entry) => sum + entry.amount, 0);
      const normalDebit = account.type === 'ASSET';
      return {
        id: account.id,
        itemName: account.name,
        category: account.type,
        currentAmount: Number(account.openingBalance) + (normalDebit ? debit - credit : credit - debit),
        previousAmount: 0,
        categoryType: account.type,
      };
    });
    const totalAssets = items
      .filter((item) => item.categoryType === 'ASSET')
      .reduce((sum, item) => sum + item.currentAmount, 0);
    const totalLiabilities = items
      .filter((item) => item.categoryType === 'LIABILITY')
      .reduce((sum, item) => sum + item.currentAmount, 0);
    const totalEquity = items
      .filter((item) => item.categoryType === 'EQUITY')
      .reduce((sum, item) => sum + item.currentAmount, 0);
    const revenue = accounts
      .filter((account) => account.type === 'REVENUE')
      .reduce((sum, account) => {
        const debit = entries.filter((entry) => entry.debitAccountCode === account.code).reduce((total, entry) => total + entry.amount, 0);
        const credit = entries.filter((entry) => entry.creditAccountCode === account.code).reduce((total, entry) => total + entry.amount, 0);
        return sum + credit - debit;
      }, 0);
    const expenses = accounts
      .filter((account) => account.type === 'EXPENSE')
      .reduce((sum, account) => {
        const debit = entries.filter((entry) => entry.debitAccountCode === account.code).reduce((total, entry) => total + entry.amount, 0);
        const credit = entries.filter((entry) => entry.creditAccountCode === account.code).reduce((total, entry) => total + entry.amount, 0);
        return sum + debit - credit;
      }, 0);
    const currentYearProfit = revenue - expenses;
    const openingEquity = totalAssets - totalLiabilities - totalEquity - currentYearProfit;
    if (Math.abs(currentYearProfit) > 0.005) {
      items.push({
        id: 'current-year-profit',
        itemName: 'Current Year Profit',
        category: AccountType.EQUITY,
        currentAmount: currentYearProfit,
        previousAmount: 0,
        categoryType: AccountType.EQUITY,
      });
    }
    if (Math.abs(openingEquity) > 0.005) {
      items.push({
        id: 'opening-equity',
        itemName: 'Opening Equity / Balancing Reserve',
        category: AccountType.EQUITY,
        currentAmount: openingEquity,
        previousAmount: 0,
        categoryType: AccountType.EQUITY,
      });
    }
    return { asOfDate: query.asOfDate, items };
  }

  async getCashFlow(query: { fromDate?: string; toDate?: string }) {
    const entries = await this.getLedgerEntries(query);
    const accounts = await this.accountsRepository.find({ where: { status: AccountStatus.ACTIVE } });
    const accountTypes = new Map(accounts.map((account) => [account.code, account.type]));
    const items = entries.map((entry) => {
      const amount = entry.amount;
      const debitType = accountTypes.get(entry.debitAccountCode);
      const creditType = accountTypes.get(entry.creditAccountCode);
      const activityType = debitType === 'ASSET' || creditType === 'ASSET' ? 'OPERATING' : 'FINANCING';
      return {
        id: entry.id,
        itemName: `${entry.referenceType} posting`,
        category: entry.referenceType,
        currentAmount: entry.debitAccountCode.startsWith('11') ? amount : -amount,
        previousAmount: 0,
        activityType,
      };
    });
    return { fromDate: query.fromDate, toDate: query.toDate, items };
  }

  async getBankReconciliations(query: { account?: string; month?: string }) {
    const saved = await this.reconciliationRepository.find({ order: { transactionDate: 'DESC' } });
    let accountId = query.account;
    if (query.account && !saved.some((item) => item.bankAccountId === query.account)) {
      const account = await this.findAccountByCode(query.account);
      accountId = account?.id ?? query.account;
    }
    const filtered = saved.filter((item) => (!accountId || item.bankAccountId === accountId) && (!query.month || item.transactionDate.startsWith(query.month)));
    if (filtered.length) return filtered.map((item) => this.toReconciliationView(item));

    const transactions = await this.getCashBankTransactions({});
    return transactions
      .filter((item) => !query.month || item.date.startsWith(query.month))
      .map((item) => ({
        id: item.id,
        date: item.date,
        description: item.particulars,
        chequeOrRef: item.reference,
        type: item.type === 'DEPOSIT' ? 'DEPOSIT' : 'WITHDRAWAL',
        amount: item.amount,
        status: 'UNMATCHED',
      }));
  }

  async createReconciliation(dto: {
    bankAccountId: string;
    transactions?: Array<{ date: string; description: string; reference?: string; type: 'DEPOSIT' | 'WITHDRAWAL'; amount: number }>;
  }) {
    if (!dto.bankAccountId) throw new UnprocessableEntityException('Bank account is required');
    const transactions = dto.transactions ?? [];
    if (!transactions.length) throw new UnprocessableEntityException('Statement contains no transactions');
    return this.reconciliationRepository.save(transactions.map((item) => this.reconciliationRepository.create({
      bankAccountId: dto.bankAccountId,
      transactionDate: item.date,
      description: item.description,
      reference: item.reference ?? null,
      type: item.type,
      amount: Number(item.amount),
      status: 'UNMATCHED',
      matchedVoucherNo: null,
      matchNote: null,
    })));
  }

  async matchReconciliation(id: string, dto: { transactionId: string; voucherNo?: string; note?: string }) {
    const item = await this.reconciliationRepository.findOne({ where: { id: dto.transactionId } });
    if (!item) throw new NotFoundException('Reconciliation transaction not found');
    item.status = 'MATCHED';
    item.matchedVoucherNo = dto.voucherNo ?? null;
    item.matchNote = dto.note ?? null;
    return this.reconciliationRepository.save(item);
  }

  async unmatchReconciliation(id: string, dto: { transactionId: string }) {
    const item = await this.reconciliationRepository.findOne({ where: { id: dto.transactionId } });
    if (!item) throw new NotFoundException('Reconciliation transaction not found');
    item.status = 'UNMATCHED';
    item.matchedVoucherNo = null;
    item.matchNote = null;
    return this.reconciliationRepository.save(item);
  }

  private toReconciliationView(item: BankReconciliationTransaction) {
    return {
      id: item.id,
      date: item.transactionDate,
      description: item.description,
      chequeOrRef: item.reference ?? '',
      type: item.type,
      amount: Number(item.amount),
      matchedVoucherNo: item.matchedVoucherNo ?? undefined,
      status: item.status,
    };
  }

  async getCashBankAccounts() {
    const accounts = await this.accountsRepository.find({
      where: { type: 'ASSET' as any, status: AccountStatus.ACTIVE },
      order: { code: 'ASC' },
    });
    const liquidAccounts = accounts.filter((account) => account.code.startsWith('11'));
    return Promise.all(liquidAccounts.map(async (account) => {
      const balance = await this.getBalance(account.id);
      return {
        id: account.id,
        name: account.name,
        accountNo: account.code,
        type: account.code === '1100' ? 'BANK' : 'CASH',
        balance: balance.balance,
        currency: 'BDT',
        status: account.status,
      };
    }));
  }

  async createCashBankAccount(dto: { code: string; name: string; type?: string; openingBalance?: number }) {
    return this.create({
      code: dto.code,
      name: dto.name,
      type: 'ASSET' as any,
      isHeader: false,
      isPostable: true,
      openingBalance: dto.openingBalance ?? 0,
      description: dto.type ? `${dto.type} account` : 'Cash and bank account',
    });
  }

  async getCashBankTransactions(query: { account?: string; fromDate?: string; toDate?: string }) {
    const [entries, accounts] = await Promise.all([
      this.getLedgerEntries(query),
      this.accountsRepository.find({ where: { status: AccountStatus.ACTIVE } }),
    ]);
    const accountNames = new Map(accounts.map((account) => [account.code, account.name]));
    let accountCode = query.account;
    if (query.account && !accounts.some((account) => account.code === query.account)) {
      accountCode = accounts.find((account) => account.id === query.account)?.code;
    }
    return entries
      .filter((entry) => !('status' in entry) || entry.status === 'APPROVED')
      .filter((entry) => {
        const isLiquid = entry.debitAccountCode.startsWith('11') || entry.creditAccountCode.startsWith('11');
        const belongsToAccount = !accountCode || entry.debitAccountCode === accountCode || entry.creditAccountCode === accountCode;
        return isLiquid && belongsToAccount;
      })
      .map((entry) => {
        const debitLiquid = entry.debitAccountCode.startsWith('11');
        const creditLiquid = entry.creditAccountCode.startsWith('11');
        return {
          id: entry.id,
          date: entry.postingDate,
          accountName: accountNames.get(debitLiquid ? entry.debitAccountCode : entry.creditAccountCode) ?? 'Cash / Bank',
          type: debitLiquid && creditLiquid ? 'TRANSFER' : debitLiquid ? 'DEPOSIT' : 'WITHDRAWAL',
          reference: `${entry.referenceType}-${entry.referenceId.slice(0, 8)}`,
          particulars: `${entry.referenceType} posting`,
          amount: entry.amount,
          status: 'COMPLETED',
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async createCashBankTransfer(dto: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    transferDate: string;
    reference?: string;
    remarks?: string;
  }) {
    await this.periodService.ensureOpen(dto.transferDate);
    if (dto.fromAccountId === dto.toAccountId || !Number.isFinite(Number(dto.amount)) || Number(dto.amount) <= 0) {
      throw new UnprocessableEntityException('Transfer requires two different accounts and a positive amount');
    }

    const [from, to] = await Promise.all([this.findOne(dto.fromAccountId), this.findOne(dto.toAccountId)]);
    if (from.type !== 'ASSET' || to.type !== 'ASSET' || !from.code.startsWith('11') || !to.code.startsWith('11')) {
      throw new UnprocessableEntityException('Both accounts must be active cash or bank accounts');
    }
    const sourceBalance = await this.getBalance(from.id);
    if (sourceBalance.balance < Number(dto.amount)) {
      throw new UnprocessableEntityException('Insufficient source account balance');
    }
    const entry = this.constructionLedgerRepository.create({
      referenceType: 'FUND_TRANSFER',
      referenceId: dto.reference?.trim() || `TRANSFER-${Date.now()}`,
      debitAccountCode: to.code,
      creditAccountCode: from.code,
      amount: Number(dto.amount),
      postingDate: dto.transferDate,
    });
    return this.constructionLedgerRepository.save(entry);
  }

  async reverseVoucher(ledgerType: 'sales' | 'payroll' | 'payables' | 'construction', id: string, actor: { id: string; email?: string }) {
    const repositories = {
      sales: this.salesLedgerRepository,
      payroll: this.payrollLedgerRepository,
      payables: this.payableLedgerRepository,
      construction: this.constructionLedgerRepository,
    } as const;
    const repository: Repository<any> = repositories[ledgerType];
    const original = await repository.findOne({ where: { id } });
    if (!original) throw new NotFoundException('Voucher ledger entry not found');
    const existingReversal = await repository.findOne({ where: { referenceType: 'REVERSAL', referenceId: id } });
    if (existingReversal) throw new ConflictException('Voucher has already been reversed');
    const postingDate = new Date().toISOString().slice(0, 10);
    await this.periodService.ensureOpen(postingDate);
    const reversal = repository.create({
      referenceType: 'REVERSAL',
      referenceId: id,
      debitAccountCode: original.creditAccountCode,
      creditAccountCode: original.debitAccountCode,
      amount: Number(original.amount),
      postingDate,
    });
    const saved = await repository.save(reversal);
    await this.auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'VOUCHER_REVERSED',
      module: 'ACCOUNTING',
      details: { ledgerType, originalId: id, reversalId: saved.id },
    });
    return { original, reversal: saved };
  }

  private async findAccountByCode(code: string) {
    return this.accountsRepository.findOne({ where: { code } });
  }

  private async getLedgerEntries(query: { account?: string; fromDate?: string; toDate?: string; projectId?: string }) {
    const [payroll, sales, payables, construction, projects] = await Promise.all([
      this.payrollLedgerRepository.find(),
      this.salesLedgerRepository.find(),
      this.payableLedgerRepository.find(),
      this.constructionLedgerRepository.find(),
      this.projectsRepository.find({ select: { id: true, projectName: true } }),
    ]);
    const projectNames = new Map(projects.map((project) => [project.id, project.projectName]));
    const entries = [...payroll.map((entry) => ({ ...entry, referenceType: `PAYROLL_${entry.referenceType}` })), ...sales, ...payables, ...construction]
      .map((entry) => ({ ...entry, projectId: 'projectId' in entry && typeof entry.projectId === 'string' ? entry.projectId : null }));
    return entries
      .filter((entry) => !query.account || entry.debitAccountCode === query.account || entry.creditAccountCode === query.account)
      .filter((entry) => !query.projectId || (query.projectId === '__unassigned__' ? !entry.projectId : entry.projectId === query.projectId))
      .filter((entry) => !query.fromDate || entry.postingDate >= query.fromDate)
      .filter((entry) => !query.toDate || entry.postingDate <= query.toDate)
      .map((entry) => ({
        ...entry,
        amount: Number(entry.amount),
        projectId: entry.projectId ?? null,
        projectName: entry.projectId ? projectNames.get(entry.projectId) ?? null : null,
        particulars: ('description' in entry && entry.description) || `${entry.referenceType} posting`,
        debit: entry.debitAccountCode === query.account ? Number(entry.amount) : 0,
        credit: entry.creditAccountCode === query.account ? Number(entry.amount) : 0,
        createdAt: entry.createdAt.toISOString(),
      }));
  }

  private async assertCodeAvailable(code: string, ignoredId?: string) {
    const existing = await this.accountsRepository.findOne({ where: { code } });
    if (existing && existing.id !== ignoredId) {
      throw new ConflictException(`Account code ${code} is already in use`);
    }
  }

  private async resolveParent(parentId: string | undefined, type: CreateAccountDto['type']): Promise<Account | null> {
    if (!parentId) return null;
    const parent = await this.findOne(parentId);
    if (parent.type !== type) {
      throw new UnprocessableEntityException('Parent account and child account must have the same account type');
    }
    if (!parent.isHeader) {
      throw new UnprocessableEntityException('A posting account cannot be used as a parent account');
    }
    return parent;
  }

  private assertAccountShape(account: Pick<CreateAccountDto, 'isHeader' | 'isPostable'>) {
    if (account.isHeader && account.isPostable) {
      throw new UnprocessableEntityException('Header accounts cannot be posting accounts');
    }
    if (!account.isHeader && !account.isPostable) {
      throw new UnprocessableEntityException('A non-header account must be posting-enabled');
    }
  }

  private toTree(accounts: Account[]): Account[] {
    const byId = new Map(accounts.map((account) => [account.id, { ...account, children: [] as Account[] }]));
    const roots: Account[] = [];
    byId.forEach((account) => {
      if (account.parentId && byId.has(account.parentId)) {
        byId.get(account.parentId).children.push(account);
      } else {
        roots.push(account);
      }
    });
    return roots;
  }
}