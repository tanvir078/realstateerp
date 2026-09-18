import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'updated@sardarlandmark.com', required: false })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John Updated', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: UserRole.ACCOUNTING_MANAGER, enum: UserRole, required: false })
  @IsEnum(UserRole, { message: 'Invalid role' })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: '+8801711223344', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Finance Department', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  isActive?: boolean;
}
