import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus, PaymentMethod } from '../entities/sale.entity';

export class SaleResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'SALE-2026-001' })
  saleId: string;

  @ApiProperty({ example: 'proj-123' })
  projectId: string;

  @ApiProperty({ example: 'Green Valley Tower' })
  projectName: string;

  @ApiProperty({ example: 'Unit 4B' })
  unitNo: string;

  @ApiProperty({ example: 12000000 })
  unitPrice: number;

  @ApiProperty({ example: 12000000 })
  totalPrice: number;

  @ApiProperty({ example: 2400000 })
  downPayment: number;

  @ApiProperty({ example: 2400000 })
  amountPaid: number;

  @ApiProperty({ example: 9600000 })
  balanceDue: number;

  @ApiProperty({ example: SaleStatus.CONFIRMED, enum: SaleStatus })
  status: SaleStatus;

  @ApiProperty({ example: PaymentMethod.INSTALLMENT, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 12 })
  installments: number;

  @ApiProperty({ example: 800000 })
  installmentAmount: number;

  @ApiProperty({ example: '2025-01-15' })
  saleDate: Date;

  @ApiProperty({ example: '2026-12-31', required: false })
  expectedCompletionDate?: Date;

  @ApiProperty({ example: '2026-12-15', required: false })
  actualCompletionDate?: Date;

  @ApiProperty({ example: 'Special customer discount applied', required: false })
  notes?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  clientId: string;

  @ApiProperty({ example: '2025-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T00:00:00.000Z' })
  updatedAt: Date;
}
