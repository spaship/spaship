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
  @IsString()
  @IsNotEmpty()
  env: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  expiredDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateApikeyDto extends PartialType(CreateApikeyDto) { }
