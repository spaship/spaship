import { Injectable } from "@nestjs/common";
import * as extract from "extract-zip";
import * as FormData from "form-data";
import * as fs from "fs";
import * as path from "path";
import { DIRECTORY_CONFIGURATION } from "src/configuration";
import { LoggerService } from "src/configuration/logger/logger.service";
import { IDataServices } from "src/repository/data-services.abstract";
import { Application } from "src/server/application/application.entity";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { CreateApplicationDto } from "../application.dto";
import { ApplicationFactory } from "./application.factory";

@Injectable()
/** @internal ApplicationService is for depenedent operations on database */
export class ApplicationService {
  constructor(private dataServices: IDataServices,
    private logger: LoggerService,
    private applicationFactoryService: ApplicationFactory,
    private exceptionService: ExceptionsService,
  ) { }

  getAllApplications(): Promise<Application[]> {
    return this.dataServices.applications.getAll();
  }

  getApplicationsByProperty(propertyIdentifier: string): Promise<Application[]> {
    return this.dataServices.applications.getByAny({ propertyIdentifier });
  }

  async saveApplication(applicationRequest: CreateApplicationDto, spaPath: string, propertyIdentifier: string, env: string): Promise<Application> {
    const identifier = this.applicationFactoryService.getIdentifier(applicationRequest.name);
    await this.deployApplication(applicationRequest, spaPath, propertyIdentifier, env);
    const spaDetails = (await this.dataServices.applications.getByAny({ propertyIdentifier, env, identifier }))[0];
    if (!spaDetails) {
      const saveApplication = await this.applicationFactoryService.createApplicationRequest(propertyIdentifier, applicationRequest, identifier, env);
      return this.dataServices.applications.create(saveApplication);
    }
    spaDetails.nextRef = applicationRequest.ref;
    spaDetails.name = applicationRequest.name;
    await this.dataServices.applications.updateOneByAny({ propertyIdentifier, env, identifier }, spaDetails);
    return spaDetails;
  }

  async deployApplication(applicationRequest: CreateApplicationDto, spaPath: string, propertyIdentifier: string, env: string): Promise<any> {
    const environmentResponse = await this.dataServices.environment.getByAny({ identifier: propertyIdentifier, env });
    if (environmentResponse.length === 0) this.exceptionService.badRequestException({ message: "Invalid Property & Environment. Please check the Deployment URL." });
    const identifier = this.applicationFactoryService.getIdentifier(applicationRequest.name);
    const propertyResponse = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    const { name, ref } = applicationRequest;
    const appPath = applicationRequest.path;
    this.logger.log("applicationRequest", JSON.stringify(applicationRequest));
    const {baseDir} = DIRECTORY_CONFIGURATION;
    const tmpDir = `${baseDir}/${name.split('.')[0]}-${Date.now()}-extracted`;
    await fs.mkdirSync(`${tmpDir}`, { recursive: true });
    await extract(path.resolve(spaPath), { dir: path.resolve(tmpDir) });
    const zipPath = await this.applicationFactoryService.createTemplateAndZip(appPath, ref, name, tmpDir, propertyIdentifier, env, propertyResponse.namespace);
    const formData: any = new FormData();
    try {
      const fileStream = await fs.createReadStream(zipPath);
      formData.append("spa", fileStream);
      formData.append("description", `${propertyIdentifier}_${env}`);
      formData.append("website", propertyIdentifier);
      const response = await this.applicationFactoryService.deploymentRequest(formData);
      this.logger.log("operatorRespobse", JSON.stringify(response.data));
      return response;
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
  }
}

