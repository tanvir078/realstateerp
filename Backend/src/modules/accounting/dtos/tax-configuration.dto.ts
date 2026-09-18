import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { TaxType } from '../entities/tax-configuration.entity';

export class CreateTaxConfigurationDto {
  @IsEnum(TaxType)
  type: TaxType;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  ratePercent: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsOptional()
  @IsString()
  outputAccountCode?: string;

  @IsOptional()
  @IsString()
  inputAccountCode?: string;

  @IsOptional()
  @IsString()
  withholdingAccountCode?: string;
}
