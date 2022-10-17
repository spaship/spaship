import { Injectable } from "@nestjs/common";
import { Application } from "../../core/entities";
import { CreateApplicationDto, UpdateApplicationDto } from "../../core/dtos";

@Injectable()
export class ApplicationFactoryService {
  createNewApplication(createApplicationDto: CreateApplicationDto) {
    const newApplication = new Application();

    return newApplication;
  }

  updateApplication(updateApplicationDto: UpdateApplicationDto) {
    const newApplication = new Application();

    return newApplication;
  }
}
