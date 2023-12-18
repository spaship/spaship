import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, IsNumber, Matches, IsArray, Length } from 'class-validator';

export class LighthouseRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  env: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isGit: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isContainerized: boolean;

  createdBy: string;
}

export class LighthouseResponseDTO {
  @ApiProperty()
  lhProjectId: string;

  @ApiProperty()
  lhBuildId: string;

  @ApiProperty()
  ciBuildURL: string;

  @ApiProperty()
  propertyIdentifier: string;

  @ApiProperty()
  identifier: string;

  @ApiProperty()
  env: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
