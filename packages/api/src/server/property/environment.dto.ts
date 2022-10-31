import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Application } from "../../core/entities";

export class EnvironmentD {
  @ApiProperty()
  propertyName: boolean;

  @ApiProperty()
  createdBy: Application;

  @ApiProperty()
  env: string;

  @ApiProperty()
  cluster: string;

  @ApiProperty()
  url: string;
}
