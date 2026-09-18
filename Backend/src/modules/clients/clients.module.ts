import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { Sale } from '../sales/entities/sale.entity';
import { RolesGuard } from '../../common/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Sale])],
  controllers: [ClientsController],
  providers: [ClientsService, RolesGuard],
  exports: [ClientsService],
})
export class ClientsModule {}
