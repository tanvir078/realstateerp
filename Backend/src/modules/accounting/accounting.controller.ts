import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountingService } from './accounting.service';
import { AccountStatus } from './entities/account.entity';
import { AccountQueryDto } from './dtos/account-query.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { AccountingPeriodService } from './period.service';
import { TaxService } from './tax.service';
import { CreateTaxConfigurationDto } from './dtos/tax-configuration.dto';
import { TaxType } from './entities/tax-configuration.entity';

@ApiTags('accounting')
@Controller('accounting/chart-of-accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get chart of accounts as a hierarchy' })
  findAll(@Query() query: AccountQueryDto) {
    return this.accountingService.findAccounts(query);
  }

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get opening-balance summary by account type' })
  getSummary() {
    return this.accountingService.getSummary();
  }

  @Get(':id/balance')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get account balance' })
  getBalance(@Param('id') id: string) {
    return this.accountingService.getBalance(id);
  }

  @Get('account-mappings')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  getAccountMappings() {
    return this.accountingService.getAccountMappings();
  }

  @Patch('account-mappings/:mappingKey')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  updateAccountMapping(@Param('mappingKey') mappingKey: string, @Body() dto: { accountCode: string }) {
    return this.accountingService.updateAccountMapping(mappingKey, dto.accountCode);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get account details' })
  findOne(@Param('id') id: string) {
    return this.accountingService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Create account head or posting account' })
  create(@Body() dto: CreateAccountDto) {
    return this.accountingService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  @ApiOperation({ summary: 'Update account metadata' })
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountingService.update(id, dto);
  }

  @Post(':id/activate')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  @ApiOperation({ summary: 'Activate account' })
  activate(@Param('id') id: string) {
    return this.accountingService.setStatus(id, AccountStatus.ACTIVE);
  }

  @Post(':id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  @ApiOperation({ summary: 'Deactivate account' })
  deactivate(@Param('id') id: string) {
    return this.accountingService.setStatus(id, AccountStatus.INACTIVE);
  }
}

@ApiTags('accounting')
@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccountingReportsController {
  constructor(private readonly accountingService: AccountingService, private readonly periodService: AccountingPeriodService, private readonly taxService: TaxService) {}

  @Get('taxes')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  listTaxes() { return this.taxService.list(); }

  @Post('taxes')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  createTax(@Body() dto: CreateTaxConfigurationDto) { return this.taxService.create(dto); }

  @Patch('taxes/:id')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  updateTax(@Param('id') id: string, @Body() dto: Partial<CreateTaxConfigurationDto>) { return this.taxService.update(id, dto); }

  @Get('taxes/calculate')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  calculateTax(@Query() query: { type: TaxType; baseAmount: string; date: string }) {
    return this.taxService.calculate(query.type, Number(query.baseAmount), query.date);
  }

  @Get('taxes/report')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  taxReport(@Query() query: { fromDate: string; toDate: string }) {
    return this.taxService.report(query.fromDate, query.toDate);
  }

  @Get('periods')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  listPeriods() { return this.periodService.list(); }

  @Get('periods/validate')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  validatePeriod(@Query() query: { periodStart: string; periodEnd: string }) {
    return this.periodService.validateClose(query.periodStart, query.periodEnd);
  }

  @Post('periods/close')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  closePeriod(@Body() dto: { periodStart: string; periodEnd: string; reason?: string }, @Req() request: { user: { id: string } }) {
    return this.periodService.close(dto.periodStart, dto.periodEnd, request.user.id, dto.reason);
  }

  @Post('periods/:id/reopen')
  @Roles(UserRole.ADMIN)
  reopenPeriod(@Param('id') id: string) { return this.periodService.reopen(id); }

  @Get('general-ledger')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get posted entries across all modules as a general ledger' })
  getGeneralLedger(@Query() query: { account?: string; fromDate?: string; toDate?: string; projectId?: string }) {
    return this.accountingService.getGeneralLedger(query);
  }

  @Get('vouchers')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get posted accounting vouchers from module ledgers' })
  getVouchers(@Query() query: { fromDate?: string; toDate?: string; type?: string }) {
    return this.accountingService.getVouchers(query);
  }

  @Post('vouchers')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  @ApiOperation({ summary: 'Create a balanced manual double-entry voucher' })
  createVoucher(@Body() dto: {
    voucherType: 'DEBIT' | 'CREDIT' | 'JOURNAL' | 'CONTRA';
    postingDate: string;
    debitAccountCode: string;
    creditAccountCode: string;
    amount: number;
    projectId?: string;
    referenceNo?: string;
    description: string;
  }) {
    return this.accountingService.createManualVoucher(dto);
  }

  @Post('vouchers/:id/approve')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  approveVoucher(@Param('id') id: string, @Req() request: { user: { email?: string } }) {
    return this.accountingService.approveManualVoucher(id, request.user?.email);
  }

  @Post('vouchers/:id/reject')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  rejectVoucher(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.accountingService.rejectManualVoucher(id, dto.reason);
  }

  @Post('vouchers/:id/reverse')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  reverseManualVoucher(@Param('id') id: string) {
    return this.accountingService.reverseManualVoucher(id);
  }

  @Post('vouchers/:ledgerType/:id/reverse')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  reverseVoucher(
    @Param('ledgerType') ledgerType: 'sales' | 'payroll' | 'payables' | 'construction',
    @Param('id') id: string,
    @Req() request: { user: { id: string; email?: string } },
  ) {
    if (!['sales', 'payroll', 'payables', 'construction'].includes(ledgerType)) {
      throw new BadRequestException('Unsupported ledger type');
    }
    return this.accountingService.reverseVoucher(ledgerType, id, request.user);
  }

  @Get('trial-balance')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  getTrialBalance(@Query() query: { fromDate?: string; toDate?: string }) {
    return this.accountingService.getTrialBalance(query);
  }

  @Post('trial-balance/export')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  exportTrialBalance(@Query() query: { fromDate?: string; toDate?: string }) {
    return this.accountingService.getTrialBalance(query);
  }

  @Get('profit-loss')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  getProfitLoss(@Query() query: { fromDate?: string; toDate?: string }) {
    return this.accountingService.getProfitLoss(query);
  }

  @Post('profit-loss/export')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  exportProfitLoss(@Query() query: { fromDate?: string; toDate?: string }) {
    return this.accountingService.getProfitLoss(query);
  }

  @Get('balance-sheet')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  getBalanceSheet(@Query() query: { asOfDate?: string }) {
    return this.accountingService.getBalanceSheet(query);
  }

  @Post('balance-sheet/export')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  exportBalanceSheet(@Query() query: { asOfDate?: string }) {
    return this.accountingService.getBalanceSheet(query);
  }

  @Get('cash-flow')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  getCashFlow(@Query() query: { fromDate?: string; toDate?: string }) {
    return this.accountingService.getCashFlow(query);
  }

  @Post('cash-flow/export')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  exportCashFlow(@Query() query: { fromDate?: string; toDate?: string }) {
    return this.accountingService.getCashFlow(query);
  }

  @Get('bank-reconciliation')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
  getBankReconciliations(@Query() query: { account?: string; month?: string }) {
    return this.accountingService.getBankReconciliations(query);
  }

  @Post('bank-reconciliation')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  createReconciliation(@Body() dto: { bankAccountId: string; transactions?: Array<{ date: string; description: string; reference?: string; type: 'DEPOSIT' | 'WITHDRAWAL'; amount: number }> }) {
    return this.accountingService.createReconciliation(dto);
  }

  @Post('bank-reconciliation/:id/match')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  matchReconciliation(@Param('id') id: string, @Body() dto: { transactionId: string; voucherNo?: string; note?: string }) {
    return this.accountingService.matchReconciliation(id, dto);
  }

  @Post('bank-reconciliation/:id/unmatch')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT)
  unmatchReconciliation(@Param('id') id: string, @Body() dto: { transactionId: string }) {
    return this.accountingService.unmatchReconciliation(id, dto);
  }

  @Get('cash-bank')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.CASHIER, UserRole.VIEWER)
  @ApiOperation({ summary: 'List live cash and bank accounts' })
  getCashBankAccounts() {
    return this.accountingService.getCashBankAccounts();
  }

  @Post('cash-bank')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER)
  @ApiOperation({ summary: 'Create a cash or bank account' })
  createCashBankAccount(@Body() dto: { code: string; name: string; type?: string; openingBalance?: number }) {
    return this.accountingService.createCashBankAccount(dto);
  }

  @Get('cash-bank/transactions')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.CASHIER, UserRole.VIEWER)
  @ApiOperation({ summary: 'List cash and bank transactions from posted ledgers' })
  getCashBankTransactions(@Query() query: { account?: string; fromDate?: string; toDate?: string }) {
    return this.accountingService.getCashBankTransactions(query);
  }

  @Post('cash-bank/transfers')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.CASHIER)
  @ApiOperation({ summary: 'Post a transfer between cash and bank accounts' })
  createCashBankTransfer(@Body() dto: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    transferDate: string;
    reference?: string;
    remarks?: string;
  }) {
    return this.accountingService.createCashBankTransfer(dto);
  }
}