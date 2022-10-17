import { Application } from "../entities";

export class CreateApplicationResponseDto {
  success: boolean;
  createdApplication: Application;
}
