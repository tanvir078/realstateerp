import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.VIEWER)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new client' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search clients by name, ID, phone, or email' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  search(@Query('q') query: string) {
    return this.clientsService.searchClients(query);
  }

  @Get('check-duplicate')
  @ApiOperation({ summary: 'Check duplicate client phone or email' })
  checkDuplicate(@Query('phone') phone?: string, @Query('email') email?: string) {
    return this.clientsService.checkDuplicate(phone, email);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get clients by status' })
  findByStatus(@Param('status') status: string) {
    return this.clientsService.findByStatus(status as any);
  }

  @Get('payment-status/:paymentStatus')
  @ApiOperation({ summary: 'Get clients by payment status' })
  findByPaymentStatus(@Param('paymentStatus') paymentStatus: string) {
    return this.clientsService.findByPaymentStatus(paymentStatus as any);
  }

  @Get('project/:project')
  @ApiOperation({ summary: 'Get clients by project' })
  findByProject(@Param('project') project: string) {
    return this.clientsService.findByProject(project);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
