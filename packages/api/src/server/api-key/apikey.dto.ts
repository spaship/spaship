import { IsString, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApikeyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyName: string;

  @ApiProperty()
  @IsNotEmpty()
  env: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expiresIn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateApikeyDto extends PartialType(CreateApikeyDto) {}
