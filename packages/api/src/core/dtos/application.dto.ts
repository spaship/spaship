import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) { }
