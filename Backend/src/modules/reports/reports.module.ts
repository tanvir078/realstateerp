import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Project } from '../projects/entities/project.entity';
import { Unit } from '../projects/entities/unit.entity';
import { Vendor } from '../procurement/entities/vendor.entity';
import { VendorBill } from '../procurement/entities/vendor-bill.entity';
import { ReportsController } from './reports.controller';
import { RolesGuard } from '../../common/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Project, Unit, Vendor, VendorBill])],
  controllers: [ReportsController],
  providers: [RolesGuard],
})
export class ReportsModule {}
