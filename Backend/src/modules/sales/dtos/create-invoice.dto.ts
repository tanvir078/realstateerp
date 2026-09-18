import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString() @IsNotEmpty() installmentId: string;
  @IsDateString() issueDate: string;
  @IsDateString() dueDate: string;
  @IsOptional() @IsString() particulars?: string;
}