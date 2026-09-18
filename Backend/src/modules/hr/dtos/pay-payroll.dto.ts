import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PayPayrollDto {
  @IsNumber() @Min(0.01)
  amount: number;

  @IsDateString()
  paymentDate: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  accountCode?: string;
}
