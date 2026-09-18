import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVendorTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
