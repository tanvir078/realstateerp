import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsEmail, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ClientType, ClientStatus, PaymentStatus } from '../entities/client.entity';

export class CreateClientDto {
  @ApiProperty({ example: 'CL-2026-001', required: false })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ example: 'Anwar Hossain', required: false })
  @IsString()
  @IsOptional() // Ekhane required thakte na chaile IsNotEmpty sorie IsOptional din
  clientName?: string;

  @ApiProperty({ example: ClientType.INDIVIDUAL, enum: ClientType, required: false })
  @IsEnum(ClientType, { message: 'Invalid client type' })
  @IsOptional()
  clientType?: ClientType;

  @ApiProperty({ example: '01711223344', required: false })
  @IsString()
  @IsOptional() // <-- Phone ke optional korar jonno IsNotEmpty sorie eta dilam
  phone?: string;

  @ApiProperty({ example: 'anwar.hossain@gmail.com', required: false })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'House 42, Road 7, Dhanmondi', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Dhaka', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Green Valley Tower', required: false })
  @IsString()
  @IsOptional()
  project?: string;

  @ApiProperty({ example: 'Unit 4B (1,850 SFT)', required: false })
  @IsString()
  @IsOptional()
  unitNo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiProperty({ example: 12000000, required: false })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @ApiProperty({ example: 8000000, required: false })
  @IsNumber()
  @IsOptional()
  totalPaid?: number;

  @ApiProperty({ example: 4000000, required: false })
  @IsNumber()
  @IsOptional()
  dueAmount?: number;

  @ApiProperty({ example: PaymentStatus.OVERDUE, enum: PaymentStatus, required: false })
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiProperty({ example: 'Tanvir Rahman', required: false })
  @IsString()
  @IsOptional()
  salesRep?: string;

  @ApiProperty({ example: ClientStatus.ACTIVE, enum: ClientStatus, required: false })
  @IsEnum(ClientStatus, { message: 'Invalid client status' })
  @IsOptional()
  status?: ClientStatus;

  @IsOptional() @IsString() area?: string;
  @IsOptional() @IsString() nid?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsString() companyRegistration?: string;
  @IsOptional() @IsString() businessType?: string;
  @IsOptional() @IsString() emergencyContact?:string;
  @IsOptional() @IsString() emergencyPhone?: string;
  @IsOptional() @IsString() emergencyRelation?: string;
  @IsOptional() @IsString() notes?: string;
}