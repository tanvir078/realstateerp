import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInstallmentDto {
  @IsString() @IsNotEmpty() bookingId: string;
  @IsString() @IsNotEmpty() title: string;
  @IsDateString() dueDate: string;
  @IsNumber() @Min(0.01) amount: number;
  @IsOptional() @IsString() remarks?: string;
}