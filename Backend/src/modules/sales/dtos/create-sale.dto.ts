import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { SaleStatus, PaymentMethod } from '../entities/sale.entity';

export class CreateSaleDto {
  @ApiProperty({ example: 'SALE-2026-001' })
  @IsString()
  @IsOptional()
  saleId: string;

  @ApiProperty({ example: 'proj-123' })
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @ApiProperty({ example: 'Green Valley Tower' })
  @IsString()
  @IsOptional()
  projectName: string;

  @ApiProperty({ example: 'Unit 4B' })
  @IsString()
  @IsOptional()
  unitNo: string;

  @ApiProperty({ example: 'unit-uuid' })
  @IsString()
  @IsNotEmpty({ message: 'Unit ID is required' })
  unitId: string;

  @ApiProperty({ example: 'parking-unit-uuid', required: false })
  @IsString()
  @IsOptional()
  parkingUnitId?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  includesParking?: boolean;

  @ApiProperty({ example: 12000000 })
  @IsNumber()
  @IsOptional()
  unitPrice: number;

  @ApiProperty({ example: 12000000 })
  @IsNumber()
  @IsOptional()
  totalPrice: number;

  @ApiProperty({ example: 2400000, required: false })
  @IsNumber()
  @IsOptional()
  downPayment?: number;

  @ApiProperty({ example: 2400000, required: false })
  @IsNumber()
  @IsOptional()
  amountPaid?: number;

  @ApiProperty({ example: 9600000, required: false })
  @IsNumber()
  @IsOptional()
  balanceDue?: number;

  @ApiProperty({ example: SaleStatus.CONFIRMED, enum: SaleStatus, required: false })
  @IsEnum(SaleStatus, { message: 'Invalid sale status' })
  @IsOptional()
  status?: SaleStatus;

  @ApiProperty({ example: PaymentMethod.INSTALLMENT, enum: PaymentMethod, required: false })
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: PaymentMethod.CASH, enum: PaymentMethod, required: false })
  @IsEnum(PaymentMethod, { message: 'Invalid booking payment method' })
  @IsOptional()
  bookingPaymentMethod?: PaymentMethod;

  @ApiProperty({ example: 12, required: false })
  @IsNumber()
  @IsOptional()
  installments?: number;

  @ApiProperty({ example: 800000, required: false })
  @IsNumber()
  @IsOptional()
  installmentAmount?: number;

  @ApiProperty({ example: '2025-01-15', required: false })
  @IsDateString()
  @IsOptional()
  saleDate?: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsDateString()
  @IsOptional()
  expectedCompletionDate?: string;

  @ApiProperty({ example: 'Special customer discount applied', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty({ message: 'Client ID is required' })
  clientId: string;
}
