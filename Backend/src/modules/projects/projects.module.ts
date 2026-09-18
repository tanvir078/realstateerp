import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { Unit } from './entities/unit.entity';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ProjectDocument } from './entities/project-document.entity';
import { ProjectPhoto } from './entities/project-photo.entity';
import { LandParcel } from './entities/land-parcel.entity';
import { UtilityConnection } from './entities/utility-connection.entity';
import { UtilityBill } from './entities/utility-bill.entity';
import { AccountingModule } from '../accounting/accounting.module';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Sale } from '../sales/entities/sale.entity';
import { VendorBill } from '../procurement/entities/vendor-bill.entity';
import { PayableLedgerEntry } from '../procurement/entities/payable-ledger.entity';
import { RABill } from '../construction/entities/construction-workflow.entity';
import { Building } from './entities/building.entity';
import { ProjectStorageService } from './project-storage.service';

@Module({
	imports: [TypeOrmModule.forFeature([Project, Building, Unit, ProjectMilestone, ProjectDocument, ProjectPhoto, LandParcel, UtilityConnection, UtilityBill, Sale, VendorBill, PayableLedgerEntry, RABill]), AccountingModule],
	controllers: [ProjectsController],
	providers: [ProjectsService, ProjectStorageService, RolesGuard],
	exports: [ProjectsService],
})
export class ProjectsModule {}
