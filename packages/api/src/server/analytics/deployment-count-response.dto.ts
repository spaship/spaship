import { ApiProperty } from '@nestjs/swagger';

export class DeploymentCount {
  @ApiProperty()
  propertyIdentifier?: string;

  @ApiProperty()
  env?: string;

  @ApiProperty()
  action?: string;

  @ApiProperty()
  count: number = 0;
}
