import { Injectable } from "@nestjs/common";
import { LoggerService } from "src/configuration/logger/logger.service";
import { IDataServices } from "src/repository/data-services.abstract";
import { Application } from "src/server/application/application.entity";
import { CreateApplicationDto } from "../application.dto";

@Injectable()
/** @internal ApplicationUseCases is for depenednt operations on database */
export class ApplicationService {
  constructor(private dataServices: IDataServices, private logger: LoggerService) { }

  getAllApplications(): Promise<Application[]> {
    return this.dataServices.applications.getAll();
  }

  getApplicationById(application: Application): Promise<Application> {
    return this.dataServices.applications.get(application.propertyName);
  }

  async createApplication(application: Application): Promise<Application> {
    const createdApplication = await this.dataServices.applications.create(application);
    return createdApplication;
  }

  updateApplication(applicationId: string, application: Application): Promise<Application> {
    return this.dataServices.applications.update(applicationId, application);
  }

  async deployApplication(applicationRequest: CreateApplicationDto, file: File): Promise<any> {
    this.logger.log("applicationRequest", JSON.stringify(applicationRequest));
    this.logger.log("file", JSON.stringify(file));
    

    return [];
  }

}
