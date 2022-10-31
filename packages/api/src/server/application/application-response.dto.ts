import { ApiProperty } from "@nestjs/swagger";
import { Application } from "src/core/entities/application.entity";

export class CreateApplicationResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  createdApplication: Application;
}
