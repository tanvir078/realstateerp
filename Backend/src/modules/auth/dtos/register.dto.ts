import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsString } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  ACCOUNTING_MANAGER = 'ACCOUNTING_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  CASHIER = 'CASHIER',
  VIEWER = 'VIEWER',
}

export class RegisterDto {
  @ApiProperty({ example: 'newuser@sardarlandmark.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ example: UserRole.ACCOUNTANT, enum: UserRole })
  @IsEnum(UserRole, { message: 'Invalid role' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;

  @ApiProperty({ example: '+8801711223344', required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Accounting Department', required: false })
  @IsString()
  department?: string;
}
