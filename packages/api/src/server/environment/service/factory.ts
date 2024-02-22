import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DIRECTORY_CONFIGURATION, SYMLINK } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/service';
import { CreateApplicationDto } from 'src/server/application/request.dto';
import { ApplicationService } from 'src/server/application/service';
import { AuthFactory } from 'src/server/auth/service/factory';
import { Environment } from 'src/server/environment/entity';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Property } from 'src/server/property/entity';
import { zip } from 'zip-a-folder';
import { CreateEnvironmentDto, OperatorSymlinkEnvironment, OperatorSymlinkMetadata, OperatorSymlinkRequest, SymlinkDTO } from '../dto';

@Injectable()
export class EnvironmentFactory {
  constructor(
    private readonly exceptionService: ExceptionsService,
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ApplicationService))
    readonly applicationService: ApplicationService
  ) {}

  createNewEnvironment(createEnvironmentDto: CreateEnvironmentDto): Environment {
    const newEnvironment = new Environment();
    newEnvironment.propertyIdentifier = createEnvironmentDto.propertyIdentifier;
    newEnvironment.env = createEnvironmentDto.env;
    newEnvironment.url = createEnvironmentDto.url;
    newEnvironment.cluster = createEnvironmentDto.cluster;
    newEnvironment.createdBy = createEnvironmentDto.createdBy;
    newEnvironment.updatedBy = createEnvironmentDto.createdBy;
    this.logger.log('NewEnvironment', JSON.stringify(newEnvironment));
    return newEnvironment;
  }

  /* @internal
   * Environment initialization and the config creation
   * Creation of environment in the cluster
   */
  async initializeEnvironment(propertyRequest: Property, environmentRequest: Environment) {
    const initializeEnvironment = new CreateApplicationDto();
    initializeEnvironment.name = 'envInit';
    initializeEnvironment.ref = '0.0.0';
    initializeEnvironment.path = '.';
    const spashipFile = {
      websiteVersion: 'v1',
      websiteName: propertyRequest.identifier,
      name: initializeEnvironment.name,
      mapping: initializeEnvironment.path,
      environments: [{ name: environmentRequest.env, updateRestriction: false, exclude: false, ns: propertyRequest.namespace }]
    };
    this.logger.log('SpashipFile', JSON.stringify(spashipFile));
    const { baseDir } = DIRECTORY_CONFIGURATION;
    const fileOriginalName = propertyRequest.identifier;
    const tmpDir = `${baseDir}/${fileOriginalName.split('.')[0]}-${Date.now()}`;
    await fs.mkdirSync(`${tmpDir}`, { recursive: true });
    await fs.writeFileSync(path.join(tmpDir, 'spaship.txt'), JSON.stringify(spashipFile, null, '\t'));
    const zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
    await zip(tmpDir, zipPath);
    try {
      await this.applicationService.deployApplication(
        initializeEnvironment,
        fileOriginalName,
        zipPath,
        propertyRequest.identifier,
        environmentRequest.env
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
  }

  // @internal Delete the environment from the property namespace
  async deleteRequest(payload: Object, deploymentBaseURL: string): Promise<any> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    return this.httpService.axiosRef.post(`${deploymentBaseURL}/api/environment/purge`, payload, { headers });
  }

  // @internal Sync the environment with the updated configuration
  async syncRequest(payload: Object, deploymentBaseURL: string, propertyIdentifier: string, env: string, namespace: string): Promise<any> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    const params: Object = { envName: env, websiteName: propertyIdentifier, namespace };
    return this.httpService.axiosRef.post(`${deploymentBaseURL}/api/environment/sync`, payload, { params, headers });
  }

  checkAndReturnCMDBCode(cmdbCode: string) {
    // @internal if CMDB code is not present we'll send the SPAS-001 as the default CMDB code
    if (cmdbCode === 'NA') return 'SPAS-001';
    return cmdbCode;
  }

  // @internal Sync the environment with the updated configuration
  async symlinkRequest(payload: Object, deploymentBaseURL: string): Promise<any> {
    if (!payload) this.exceptionService.badRequestException({ message: 'Please provide payload' });
    if (!deploymentBaseURL) this.exceptionService.badRequestException({ message: 'Please provide the deployment url' });
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    return this.httpService.axiosRef.post(`${deploymentBaseURL}/api/execute/command`, payload, { headers });
  }

  createOperatorSymlinkPayload(env: string, property: Property, request: SymlinkDTO) {
    if (!property || !env) this.exceptionService.badRequestException({ message: 'Please provide property details' });
    if (!request) this.exceptionService.badRequestException({ message: 'Please provide the request body' });
    const operatorPayload = new OperatorSymlinkRequest();
    const environment = new OperatorSymlinkEnvironment();
    const metadata = new OperatorSymlinkMetadata();
    environment.websiteName = property.identifier;
    environment.nameSpace = property.namespace;
    environment.name = env;
    operatorPayload.environment = environment;
    metadata.source = request.source;
    metadata.target = request.target;
    operatorPayload.metadata = metadata;
    operatorPayload.commandType = SYMLINK.CREATE;
    return operatorPayload;
  }

  // @internal Build the folder path
  buildFolderPath(folderPath: string): string {
    // @internal it will replace the heading & trailing slash frm the folder path
    return folderPath.replace(/^\/+/g, '').replace(/\/+$/, '');
  }
}
