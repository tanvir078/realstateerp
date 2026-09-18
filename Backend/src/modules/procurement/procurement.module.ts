import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementController } from './procurement.controller';
import { ProcurementService } from './procurement.service';
import { Vendor } from './entities/vendor.entity';
import { VendorBill } from './entities/vendor-bill.entity';
import { PurchaseRequisition, PurchaseOrder, GoodsReceipt } from './entities/purchase-workflow.entity';
import { PayableLedgerEntry } from './entities/payable-ledger.entity';
import { AccountingModule } from '../accounting/accounting.module';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Project } from '../projects/entities/project.entity';
import { VendorType } from './entities/vendor-type.entity';

@Module({ imports: [TypeOrmModule.forFeature([Vendor, VendorType, VendorBill, PurchaseRequisition, PurchaseOrder, GoodsReceipt, PayableLedgerEntry, Project]), AccountingModule], controllers: [ProcurementController], providers: [ProcurementService, RolesGuard], exports: [ProcurementService] })
export class ProcurementModule {}
