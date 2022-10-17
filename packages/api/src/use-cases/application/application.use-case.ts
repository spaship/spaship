import { Injectable } from "@nestjs/common";
import { Application } from "../../core/entities";
import { IDataServices, IDeploymentServices } from "../../core/abstracts";

@Injectable()
export class ApplicationUseCases {
  constructor(private dataServices: IDataServices, private deploymentServices: IDeploymentServices) {}

  getAllApplications(): Promise<Application[]> {
    return this.dataServices.applications.getAll();
  }

  getApplicationById(application: Application): Promise<Application> {
    return this.dataServices.applications.get(application.propertyName);
  }

  async createApplication(application: Application): Promise<Application> {
    const createdApplication = await this.dataServices.applications.create(application);
    await this.deploymentServices.deployApplication(createdApplication);
    return createdApplication;
  }

  updateApplication(applicationId: string, application: Application): Promise<Application> {
    return this.dataServices.applications.update(applicationId, application);
  }
}
