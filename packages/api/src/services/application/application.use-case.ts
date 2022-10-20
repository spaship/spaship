import { Injectable } from "@nestjs/common";
import { IDataServices } from "../../core/abstracts";
import { Application } from "../../core/entities";

@Injectable()
/** @internal ApplicationUseCases is for depenednt operations on database */
export class ApplicationUseCases {
  constructor(private dataServices: IDataServices) {}

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
}
