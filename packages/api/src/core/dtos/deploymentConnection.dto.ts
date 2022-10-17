import { IsString, IsNotEmpty, IsDate, IsUrl } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

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
  alias: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateDeploymentConnectionDTO extends PartialType(DeploymentConnectionDTO) { }
