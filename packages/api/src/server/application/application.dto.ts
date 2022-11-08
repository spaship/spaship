import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ref: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ephemeral: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  actionId: string;
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
