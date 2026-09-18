import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../entities/sale.entity';

export class RefundBookingDto {
  @IsNumber() @Min(0.01) amount: number;
  @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;
  @IsDateString() refundDate: string;
  @IsOptional() @IsString() referenceNo?: string;
}
