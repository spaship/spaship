import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  autoGenerateLHReport: boolean;

  createdBy: string;
}

export class LighthouseMetrics {
  @ApiProperty()
  performance: string;

  @ApiProperty()
  accessibility: string;

  @ApiProperty()
  bestPractices: string;

  @ApiProperty()
  seo: string;

  @ApiProperty()
  pwa: string;

  @ApiProperty()
  firstContentfulPaint: string;

  @ApiProperty()
  firstMeaningfulPaint: string;

  @ApiProperty()
  largestContentfulPaint: string;

  @ApiProperty()
  speedIndex: string;

  @ApiProperty()
  totalBlockingTime: string;

  @ApiProperty()
  cumulativeLayoutShift: string;
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
  metrics: LighthouseMetrics;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class LighthouseServerResponse {
  buildId: string;

  id: string;

  externalBuildUrl: string;

  lhr: string;

  createdAt: string;

  updatedAt: string;
}
