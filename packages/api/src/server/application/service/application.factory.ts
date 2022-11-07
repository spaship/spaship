import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { CreateApplicationDto, UpdateApplicationDto } from 'src/server/application/application.dto';
import { Application } from 'src/server/application/application.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { zip } from 'zip-a-folder';

@Injectable()
/** @internal ApplicationFactoryService is for the business logics */
export class ApplicationFactory {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly exceptionService: ExceptionsService
  ) {}

  async createTemplateAndZip(
    appPath: string,
    ref: string,
    name: string,
    tmpDir: string,
    propertyIdentifier: string,
    env: string,
    namespace: string
  ): Promise<string> {
    const fileExists = async (path) => !!(await fs.promises.stat(path).catch((e) => false));
    const rootspa = 'ROOTSPA';
    if (appPath.charAt(0) == '/' && appPath.length === 1) appPath = rootspa;
    else if (appPath.charAt(0) == '/') appPath = appPath.substr(1);
    const spashipFile = {
      websiteVersion: ref || 'v1',
      websiteName: propertyIdentifier,
      name,
      mapping: appPath,
      environments: [{ name: env, updateRestriction: false, exclude: false, ns: namespace }]
    };
    this.logger.log('SpashipFile', JSON.stringify(spashipFile));
    let zipPath;
    try {
      if (await fileExists(path.join(tmpDir, 'dist'))) {
        await fs.writeFileSync(path.join(tmpDir, 'dist/.spaship'), JSON.stringify(spashipFile, null, '\t'));
        zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
        await zip(path.join(tmpDir, 'dist'), zipPath);
      } else if (await fileExists(path.join(tmpDir, 'build'))) {
        await fs.writeFileSync(path.join(tmpDir, 'build/.spaship'), JSON.stringify(spashipFile, null, '\t'));
        zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
        await zip(path.join(tmpDir, 'build'), zipPath);
      } else {
        await fs.writeFileSync(path.join(tmpDir, '.spaship'), JSON.stringify(spashipFile, null, '\t'));
        zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
        await zip(tmpDir, zipPath);
      }
      this.logger.log('ZipPath', zipPath);
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return zipPath;
  }

  deploymentRequest(formData: FormData, deploymentBaseURL: string): Promise<AxiosResponse<any, any>> {
    return this.httpService.axiosRef.post(`${deploymentBaseURL}/api/upload`, formData, {
      maxBodyLength: Infinity,
      headers: formData.getHeaders()
    });
  }

  createNewApplication(createApplicationDto: CreateApplicationDto): Application {
    const newApplication = new Application();
    newApplication.name = createApplicationDto.name;
    newApplication.path = createApplicationDto.path;
    return newApplication;
  }

  updateApplication(updateApplicationDto: UpdateApplicationDto) {
    const newApplication = new Application();
    return newApplication;
  }

  createApplicationRequest(propertyIdentifier: string, applicationRequest: CreateApplicationDto, identifier: string, env: string): Application {
    const saveApplication = new Application();
    saveApplication.propertyIdentifier = propertyIdentifier;
    saveApplication.name = applicationRequest.name;
    saveApplication.path = applicationRequest.path;
    saveApplication.identifier = identifier;
    saveApplication.nextRef = applicationRequest.ref;
    saveApplication.env = env;
    saveApplication.propertyIdentifier = propertyIdentifier;
    saveApplication.ref = 'NA';
    saveApplication.accessUrl = 'NA';
    return saveApplication;
  }

  getIdentifier(identifier): string {
    return (
      encodeURIComponent(identifier)
        .toLowerCase()
        /* Replace the encoded hexadecimal code with `-` */
        .replace(/%[0-9a-zA-Z]{2}/g, '-')
        /* Replace any special characters with `-` */
        .replace(/[\ \-\/\:\@\[\]\`\{\~\.]+/g, '-')
        /* Special characters are replaced by an underscore */
        .replace(/[\|!@#$%^&*;"<>\(\)\+,]/g, '_')
        /* Remove any starting or ending `-` */
        .replace(/^-+|-+$/g, '')
        /* Removing multiple consecutive `-`s */
        .replace(/--+/g, '-')
    );
  }
}
