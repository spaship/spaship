import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  path: string;

  // /**
  //  * printng the name of the application
  //  */
  // public toString(): Promise<string> {
  //   return Promise.resolve(`CreateApplicationDto[ spaName = ${this.spaName}, path =  ${this.path}]`);
  // }
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
