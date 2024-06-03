import { ApiProperty } from '@nestjs/swagger';
import { Application } from '../application/entity';

export class ReportDetails {
  @ApiProperty()
  propertyName: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty()
  cmdbCode: string;

  @ApiProperty()
  severity: string;

  @ApiProperty()
  environments: EnvironmentDetails[];

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class EnvironmentDetails {
  @ApiProperty()
  identifier: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  cluster: string;

  @ApiProperty()
  applications: Application[];

  @ApiProperty()
  podlist: String[];
}

export class ApplicationDetails {
  @ApiProperty()
  identifier: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  ref: string;

  @ApiProperty()
  cmdbCode: string;

  @ApiProperty()
  severity: string;

  @ApiProperty()
  routerUrl: string[];

  @ApiProperty()
  podlist: String[];

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: Date;
}
