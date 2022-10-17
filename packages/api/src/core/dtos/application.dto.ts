import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  spaName: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
