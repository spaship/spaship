import { ApiProperty } from "@nestjs/swagger";
import { Application } from "../../core/entities";

export class CreateApplicationResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  createdApplication: Application;
}
