import { IsString, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateApikeyDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  propertyName: string;

  @IsString()
  @IsNotEmpty()
  env: string[];

  @IsString()
  @IsNotEmpty()
  expiredDate: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateApikeyDto extends PartialType(CreateApikeyDto) {}
