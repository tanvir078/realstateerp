import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ProjectType, ProjectStatus } from '../entities/project.entity';

export class UpdateProjectDto {
  @IsOptional() @IsString() projectName?: string;
  @IsOptional() @IsEnum(ProjectType) projectType?: ProjectType;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() landSize?: string;
  @IsOptional() @IsInt() @Min(0) totalFloors?: number;
  @IsOptional() @IsInt() @Min(0) totalUnits?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(100) developerRatio?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(100) landownerRatio?: number;
  @IsOptional() @IsDateString() targetLaunchDate?: string;
  @IsOptional() @IsDateString() expectedHandover?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(100) constructionProgress?: number;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
}
