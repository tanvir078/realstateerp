import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountStatus, AccountType } from '../entities/account.entity';

export class AccountQueryDto {
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsString()
  search?: string;
}