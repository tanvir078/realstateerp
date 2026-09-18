import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { Investor } from './entities/investor.entity';
import { InvestorAllocation } from './entities/investor-allocation.entity';
import { InvestorPayout } from './entities/investor-payout.entity';
import { ConstructionLedgerEntry } from '../construction/entities/construction-ledger.entity';
import { AccountingModule } from '../accounting/accounting.module';
import { RolesGuard } from '../../common/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Investor, InvestorAllocation, InvestorPayout, ConstructionLedgerEntry]), AccountingModule],
  controllers: [InvestorsController],
  providers: [InvestorsService, RolesGuard],
  exports: [InvestorsService],
})
export class InvestorsModule {}
