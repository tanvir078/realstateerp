import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProcurementService } from './procurement.service';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { CreateVendorBillDto } from './dtos/create-vendor-bill.dto';
import { CreateVendorTypeDto } from './dtos/create-vendor-type.dto';
import { PayVendorBillDto } from './dtos/pay-vendor-bill.dto';
import { CreateGoodsReceiptDto, CreatePurchaseOrderDto, CreateRequisitionDto } from './dtos/purchase-workflow.dto';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
@ApiTags('procurement') @Controller('procurement') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.VIEWER) @ApiBearerAuth()
export class ProcurementController { constructor(private service: ProcurementService) {} @Get('vendor-types') vendorTypes() { return this.service.findVendorTypes(); } @Post('vendor-types') createVendorType(@Body() dto: CreateVendorTypeDto) { return this.service.createVendorType(dto); } @Get('vendors') vendors() { return this.service.findVendors(); } @Post('vendors') createVendor(@Body() dto: CreateVendorDto) { return this.service.createVendor(dto); } @Get('vendor-bills') bills() { return this.service.findBills(); }  @Post('vendor-bills') createBill(@Body() dto: CreateVendorBillDto) { return this.service.createBill(dto); } @Post('vendor-bills/:id/post') postBill(@Param('id') id: string) { return this.service.postBill(id); } @Post('vendor-bills/pay') pay(@Body() dto: PayVendorBillDto) { return this.service.payBill(dto); } @Get('requisitions') requisitions() { return this.service.findRequisitions(); } @Post('requisitions') createRequisition(@Body() dto: CreateRequisitionDto) { return this.service.createRequisition(dto); } @Post('requisitions/:id/submit') submit(@Param('id') id: string) { return this.service.submitRequisition(id); } @Get('purchase-orders') purchaseOrders() { return this.service.findPurchaseOrders(); } @Post('purchase-orders') createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) { return this.service.createPurchaseOrder(dto); } @Post('purchase-orders/:id/approve') approve(@Param('id') id: string) { return this.service.approvePurchaseOrder(id); } @Post('goods-receipts') receive(@Body() dto: CreateGoodsReceiptDto) { return this.service.createGoodsReceipt(dto); } }