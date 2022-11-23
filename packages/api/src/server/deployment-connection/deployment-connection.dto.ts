import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeploymentConnectionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  baseurl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cluster: string;
}

export class UpdateDeploymentConnectionDTO extends PartialType(DeploymentConnectionDTO) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;
}
