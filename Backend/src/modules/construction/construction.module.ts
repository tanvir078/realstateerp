import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructionController } from './construction.controller';
import { ConstructionService } from './construction.service';
import { MaterialRequisition, ConstructionWorkOrder, RABill } from './entities/construction-workflow.entity';
import { ConstructionLedgerEntry } from './entities/construction-ledger.entity';
import { Contractor } from './entities/contractor.entity';
import { ConstructionEquipment } from './entities/equipment.entity';
import { ConstructionFuelLog } from './entities/fuel-log.entity';
import { SiteLaborRecord } from './entities/site-labor.entity';
import { AccountingModule } from '../accounting/accounting.module';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Project } from '../projects/entities/project.entity';

@Module({ imports: [TypeOrmModule.forFeature([MaterialRequisition, ConstructionWorkOrder, RABill, ConstructionLedgerEntry, Contractor, ConstructionEquipment, ConstructionFuelLog, SiteLaborRecord, Project]), AccountingModule], controllers: [ConstructionController], providers: [ConstructionService, RolesGuard], exports: [ConstructionService] })
export class ConstructionModule {}
