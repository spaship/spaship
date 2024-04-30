import { ApiProperty } from '@nestjs/swagger';

export class UserAnalytics {
  @ApiProperty()
  propertyIdentifier: string;

  @ApiProperty()
  identifiers: string[];

  @ApiProperty()
  applicationCount: number;

  @ApiProperty()
  deploymentCount: number;
}
