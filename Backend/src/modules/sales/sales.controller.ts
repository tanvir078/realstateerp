import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInstallmentDto } from './dtos/create-installment.dto';
import { CollectPaymentDto } from './dtos/collect-payment.dto';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { RefundBookingDto } from './dtos/refund-booking.dto';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.VIEWER)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new sale' })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm pending booking' })
  confirm(@Param('id') id: string) { return this.salesService.confirm(id); }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking and release unit' })
  cancel(@Param('id') id: string) { return this.salesService.cancel(id); }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund booking advance and post reversal ledger entry' })
  refund(@Param('id') id: string, @Body() dto: RefundBookingDto) {
    return this.salesService.refundBooking(id, dto);
  }

  @Get('installments')
  @ApiOperation({ summary: 'List installment and receivable schedule' })
  findInstallments() { return this.salesService.findInstallments(); }

  @Post('installments')
  @ApiOperation({ summary: 'Create installment against confirmed booking' })
  createInstallment(@Body() dto: CreateInstallmentDto) { return this.salesService.createInstallment(dto); }

  @Post('collections')
  @ApiOperation({ summary: 'Record collection, issue money receipt, and post AR ledger entry' })
  collectPayment(@Body() dto: CollectPaymentDto) { return this.salesService.collectPayment(dto); }

  @Get('collections')
  @ApiOperation({ summary: 'List collection receipts' })
  findCollections() { return this.salesService.findCollections(); }

  @Get('invoices')
  @ApiOperation({ summary: 'List invoices and money-receipt references' })
  findInvoices() { return this.salesService.findInvoices(); }

  @Post('invoices')
  @ApiOperation({ summary: 'Issue invoice against installment' })
  createInvoice(@Body() dto: CreateInvoiceDto) { return this.salesService.createInvoice(dto); }

  @Get('handovers')
  @ApiOperation({ summary: 'List live property handovers' })
  findHandovers() { return this.salesService.findHandovers(); }

  @Post('handovers')
  @ApiOperation({ summary: 'Initiate handover for a fully paid booking' })
  initiateHandover(@Body() dto: { saleId: string; scheduledDate: string }) {
    return this.salesService.initiateHandover(dto);
  }

  @Post('handovers/:id/start')
  @ApiOperation({ summary: 'Start handover verification' })
  startHandover(@Param('id') id: string) { return this.salesService.startHandover(id); }

  @Post('handovers/:id/complete')
  @ApiOperation({ summary: 'Complete property handover checklist' })
  completeHandover(@Param('id') id: string) { return this.salesService.completeHandover(id); }

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  findAll() {
    return this.salesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search sales by sale ID, project, unit, or client name' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  search(@Query('q') query: string) {
    return this.salesService.searchSales(query);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get sales by client ID' })
  findByClient(@Param('clientId') clientId: string) {
    return this.salesService.findByClientId(clientId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get sales by project ID' })
  findByProject(@Param('projectId') projectId: string) {
    return this.salesService.findByProjectId(projectId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get sales by status' })
  findByStatus(@Param('status') status: string) {
    return this.salesService.findByStatus(status as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  findOne(@Param('id') id: string) {
    return this.salesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sale' })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Patch(':id/payment')
  @ApiOperation({ summary: 'Update payment status for sale' })
  @ApiQuery({ name: 'amountPaid', required: true, description: 'Amount paid' })
  updatePaymentStatus(@Param('id') id: string, @Query('amountPaid') amountPaid: number) {
    return this.salesService.updatePaymentStatus(id, amountPaid);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sale' })
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
