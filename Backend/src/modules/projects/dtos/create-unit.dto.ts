import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { UnitOwnership, UnitStatus, UnitType } from '../entities/unit.entity';

export class CreateUnitDto {
  @IsString() @IsNotEmpty() projectId: string;
  @IsString() @IsNotEmpty() unitCode: string;
  @IsString() @IsNotEmpty() floorLevel: string;
  @IsEnum(UnitType) unitType: UnitType;
  @IsNumber() @Min(0) size: number;
  @IsString() @IsNotEmpty() facing: string;
  @IsInt() @Min(0) bedrooms: number;
  @IsInt() @Min(0) bathrooms: number;
  @IsNumber() @Min(0) basePricePerSft: number;
  @IsOptional() @IsNumber() @Min(0) parkingPrice?: number;
  @IsOptional() @IsNumber() @Min(0) utilityCharges?: number;
  @IsOptional() @IsEnum(UnitOwnership) ownership?: UnitOwnership;
  @IsOptional() @IsEnum(UnitStatus) status?: UnitStatus;
  @IsOptional() @IsNumber() @Min(0) price?: number;
}