import { ApiProperty } from "@nestjs/swagger";
import { Application } from "../entities";

export class CreateApplicationResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  createdApplication: Application;
}
