import { ApiProperty } from '@nestjs/swagger';
import { Environment } from '../environment/entity';

export class PropertyResponseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  identifier: string;

  @ApiProperty()
  cluster: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  cmdbCode: string;

  @ApiProperty()
  severity: string;

  @ApiProperty()
  env: Environment[];

  @ApiProperty()
  createdBy: string;
}
