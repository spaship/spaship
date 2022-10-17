import { IsString, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateDeploymentRecordDto {
  @IsString()
  @IsNotEmpty()
  propertyName: string;

  @IsString()
  @IsNotEmpty()
  deploymentConnectionName: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateDeploymentRecordDto extends PartialType(CreateDeploymentRecordDto) {}
