import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Application } from 'src/server/application/application.entity';
import { Environment } from './environment.entity';

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
  env: Environment[];

  @ApiProperty()
  createdBy: string;
}
