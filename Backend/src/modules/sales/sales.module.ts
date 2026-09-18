import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';
import { Client } from '../clients/entities/client.entity';
import { Unit } from '../projects/entities/unit.entity';
import { Installment } from './entities/installment.entity';
import { CollectionPayment } from './entities/collection-payment.entity';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { Invoice } from './entities/invoice.entity';
import { Handover } from './entities/handover.entity';
import { AccountingModule } from '../accounting/accounting.module';
import { RolesGuard } from '../../common/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Client, Unit, Installment, CollectionPayment, LedgerEntry, Invoice, Handover]), AccountingModule],
  controllers: [SalesController],
  providers: [SalesService, RolesGuard],
  exports: [SalesService],
})
export class SalesModule {}