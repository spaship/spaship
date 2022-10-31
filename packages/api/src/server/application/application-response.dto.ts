import { ApiProperty } from "@nestjs/swagger";
import { Application } from "src/server/application/application.entity";

export class CreateApplicationResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  createdApplication: Application;
}
