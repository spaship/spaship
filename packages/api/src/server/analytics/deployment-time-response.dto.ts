import { ApiProperty } from '@nestjs/swagger';

export class DeploymentTime {
  @ApiProperty()
  averageTime: number;

  @ApiProperty()
  days: number;

  @ApiProperty({ isArray: true, type: () => AverageDeploymentDetails })
  deploymentDetails: AverageDeploymentDetails[];
}

export class AverageDeploymentDetails {
  @ApiProperty()
  propertyIdentifier?: string;

  @ApiProperty()
  applicationIdentifier?: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  totalTime: number;

  @ApiProperty()
  averageTime: number;
}
