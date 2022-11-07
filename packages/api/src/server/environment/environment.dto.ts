import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnvironmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  env: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cluster: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
