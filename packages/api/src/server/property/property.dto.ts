import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Application } from "src/core/entities/application.entity";

export class CreatePropertyDto {
  @ApiProperty()
  propertyName: boolean;

  @ApiProperty()
  propertyTitle: Application;

  @ApiProperty()
  env: string;

  @ApiProperty()
  cluster: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdBy: Application;
}
