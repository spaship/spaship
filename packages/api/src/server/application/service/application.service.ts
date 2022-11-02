import { Injectable } from "@nestjs/common";
import * as extract from "extract-zip";
import * as FormData from "form-data";
import * as fs from "fs";
import * as path from "path";
import { LoggerService } from "src/configuration/logger/logger.service";
import { IDataServices } from "src/repository/data-services.abstract";
import { Application } from "src/server/application/application.entity";
import { CreateApplicationDto } from "../application.dto";
import { ApplicationFactoryService } from "./application.factory";


@Injectable()
/** @internal ApplicationUseCases is for depenednt operations on database */
export class ApplicationService {
  constructor(private dataServices: IDataServices,
    private logger: LoggerService,
    private applicationFactoryService: ApplicationFactoryService,
  ) { }

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

  async deployApplication(applicationRequest: CreateApplicationDto, file: any): Promise<any> {
    const { name, ref } = applicationRequest;
    const appPath = applicationRequest.path;
    this.logger.log("applicationRequest", JSON.stringify(applicationRequest));
    this.logger.log("file", JSON.stringify(file));
    const baseDir = './spaship_uploads';
    const fileOriginalName = file.originalname;
    const tmpDir = `${baseDir}/${fileOriginalName.split('.')[0]}-${Date.now()}-extracted`;
    await fs.mkdirSync(`${tmpDir}`, { recursive: true });
    await extract(path.resolve(file.path), { dir: path.resolve(tmpDir) });
    const zipPath = await this.applicationFactoryService.createTemplateAndZip(appPath, ref, name, tmpDir);
    const formData: any = new FormData();
    try {
      const fileStream = await fs.createReadStream(zipPath);
      formData.append("spa", fileStream);
      formData.append("description", 'property');
      formData.append("website", 'property');

      const response = await this.applicationFactoryService.deploymentRequest(formData);
      console.log(response.data);
      return true;
    } catch (err) {
      console.log(err);
      return;
    }

    return [];
  }


}

