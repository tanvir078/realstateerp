import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CollectPaymentDto {
  @IsString() @IsNotEmpty() installmentId: string;
  @IsNumber() @Min(0.01) amount: number;
  @IsString() @IsNotEmpty() paymentMethod: string;
  @IsOptional() @IsString() referenceNo?: string;
  @IsOptional() @IsString() accountCode?: string;
  @IsDateString() paymentDate: string;
  @IsOptional() @IsString() remarks?: string;
}