import { IsString, IsNotEmpty, IsDate, IsUrl } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class DeploymentConnectionDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  baseurl: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateDeploymentConnectionDTO extends PartialType(DeploymentConnectionDTO) {}
