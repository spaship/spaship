import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Application } from 'src/server/application/application.entity';

export class PropertyEnvDTO {
  @ApiProperty()
  propertyName: boolean;

  @ApiProperty()
  createdBy: Application;

  @ApiProperty()
  env: string;

  @ApiProperty()
  cluster: string;

  @ApiProperty()
  url: string;
}
