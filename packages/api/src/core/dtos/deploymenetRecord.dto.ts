import { IsString, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeploymentRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deploymentConnectionName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateDeploymentRecordDto extends PartialType(CreateDeploymentRecordDto) { }
