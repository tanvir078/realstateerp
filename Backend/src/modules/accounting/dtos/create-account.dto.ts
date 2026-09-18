import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, Min } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9A-Za-z-]+$/)
  @MaxLength(20)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsBoolean()
  isHeader: boolean;

  @IsBoolean()
  isPostable: boolean;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === undefined ? 0 : Number(value)))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  openingBalance?: number;

  @IsOptional()
  @IsString()
  description?: string;
}