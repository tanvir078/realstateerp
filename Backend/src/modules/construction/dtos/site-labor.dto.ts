import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSiteLaborDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  projectSite: string;

  @IsString()
  @IsNotEmpty()
  projectId?: string;

  @IsString()
  @IsNotEmpty()
  contractor: string;

  @IsNumber()
  @Min(0)
  masonsCount: number;

  @IsNumber()
  @Min(0)
  masonsRate: number;

  @IsNumber()
  @Min(0)
  helpersCount: number;

  @IsNumber()
  @Min(0)
  helpersRate: number;

  @IsNumber()
  @Min(0)
  electriciansCount: number;

  @IsNumber()
  @Min(0)
  electriciansRate: number;

  @IsNumber()
  @Min(0)
  carpentersCount: number;

  @IsNumber()
  @Min(0)
  carpentersRate: number;

  @IsNumber()
  @Min(0)
  overtimeHours: number;

  @IsNumber()
  @Min(0)
  overtimeRate: number;
}

export class DisburseSiteLaborDto {
  @IsDateString()
  disbursementDate: string;

  @IsString()
  @IsIn(['CASH', 'BANK_TRANSFER', 'MOBILE_BANKING'])
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  referenceNumber: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
