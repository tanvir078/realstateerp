import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingController, AccountingReportsController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { Account } from './entities/account.entity';
import { PayrollLedgerEntry } from '../hr/entities/payroll-ledger.entity';
import { LedgerEntry } from '../sales/entities/ledger-entry.entity';
import { PayableLedgerEntry } from '../procurement/entities/payable-ledger.entity';
import { ConstructionLedgerEntry } from '../construction/entities/construction-ledger.entity';
import { BankReconciliationTransaction } from './entities/bank-reconciliation.entity';
import { RolesGuard } from '../../common/auth/roles.guard';
import { AccountingPeriod } from './entities/accounting-period.entity';
import { AccountingPeriodService } from './period.service';
import { AuditModule } from '../audit/audit.module';
import { TaxConfiguration } from './entities/tax-configuration.entity';
import { TaxService } from './tax.service';
import { PayrollRun } from '../hr/entities/hr-workflow.entity';
import { VendorBill } from '../procurement/entities/vendor-bill.entity';
import { RABill } from '../construction/entities/construction-workflow.entity';
import { AccountMapping } from './entities/account-mapping.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Account, AccountMapping, Project, PayrollRun, VendorBill, RABill, PayrollLedgerEntry, LedgerEntry, PayableLedgerEntry, ConstructionLedgerEntry, BankReconciliationTransaction, AccountingPeriod, TaxConfiguration]), AuditModule],
	controllers: [AccountingController, AccountingReportsController],
	providers: [AccountingService, AccountingPeriodService, TaxService, RolesGuard],
	exports: [AccountingService, AccountingPeriodService, TaxService],
})
export class AccountingModule {}
