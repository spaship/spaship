import { Injectable } from "@nestjs/common";
import { Application } from "../../core/entities";
import { CreateApplicationDto, UpdateApplicationDto } from "../../core/dtos";

@Injectable()
/** @internal ApplicationFactoryService is for the business logics */
export class ApplicationFactoryService {
  createNewApplication(createApplicationDto: CreateApplicationDto): Application {
    const newApplication = new Application();
    newApplication.spaName = createApplicationDto.name;
    newApplication.path = createApplicationDto.path;
    return newApplication;
  }

  updateApplication(updateApplicationDto: UpdateApplicationDto) {
    const newApplication = new Application();

    return newApplication;
  }
}
