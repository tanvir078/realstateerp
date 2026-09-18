import { ApiProperty } from '@nestjs/swagger';
import { ClientType, PaymentStatus, ClientStatus } from '../entities/client.entity';

export class ClientResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'CL-2026-001' })
  clientId: string;

  @ApiProperty({ example: 'Anwar Hossain' })
  clientName: string;

  @ApiProperty({ example: ClientType.INDIVIDUAL, enum: ClientType })
  clientType: ClientType;

  @ApiProperty({ example: '01711223344' })
  phone: string;

  @ApiProperty({ example: 'anwar.hossain@gmail.com', required: false })
  email?: string;

  @ApiProperty({ example: 'House 42, Road 7, Dhanmondi', required: false })
  address?: string;

  @ApiProperty({ example: 'Dhaka', required: false })
  city?: string;

  @ApiProperty({ example: 'Green Valley Tower', required: false })
  project?: string;

  @ApiProperty({ example: 'Unit 4B (1,850 SFT)', required: false })
  unitNo?: string;

  @ApiProperty({ example: 12000000 })
  totalPrice: number;

  @ApiProperty({ example: 8000000 })
  totalPaid: number;

  @ApiProperty({ example: 4000000 })
  dueAmount: number;

  @ApiProperty({ example: PaymentStatus.OVERDUE, enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty({ example: 'Tanvir Rahman', required: false })
  salesRep?: string;

  @ApiProperty({ example: ClientStatus.ACTIVE, enum: ClientStatus })
  status: ClientStatus;

  @ApiProperty({ example: '2025-01-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T00:00:00.000Z' })
  updatedAt: Date;
}
