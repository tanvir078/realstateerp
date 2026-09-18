import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ProjectType } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString() @IsNotEmpty() projectName: string;
  @IsEnum(ProjectType) projectType: ProjectType;
  @IsString() @IsNotEmpty() location: string;
  @IsString() @IsNotEmpty() landSize: string;
  @IsInt() @Min(0) totalFloors: number;
  @IsInt() @Min(0) totalUnits: number;
  @IsNumber() @Min(0) @Max(100) developerRatio: number;
  @IsNumber() @Min(0) @Max(100) landownerRatio: number;
  @IsDateString() targetLaunchDate: string;
  @IsDateString() expectedHandover: string;
}