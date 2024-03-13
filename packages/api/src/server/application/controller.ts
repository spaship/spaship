import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { DIRECTORY_CONFIGURATION, VALIDATION } from '../../configuration';
import { AuthenticationGuard } from '../auth/guard';
import { ExceptionsService } from '../exceptions/service';
import {
  ApplicationConfigDTO,
  ApplicationResponse,
  CreateApplicationDto,
  DeleteApplicationSyncDTO,
  EnableApplicationSyncDTO,
  GitDeploymentRequestDTO,
  GitValidationRequestDTO,
  SymlinkDTO
} from './request.dto';
import { Application } from './entity';
import { ApplicationFactory } from './service/factory';
import { ApplicationService } from './service';

@Controller('applications')
@ApiTags('Application')
@UseGuards(AuthenticationGuard)
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationFactory: ApplicationFactory,
    private readonly exceptionService: ExceptionsService
  ) {}

  @Get('/property/:identifier')
  @ApiOperation({ description: 'Get the list of Properties.' })
  async getApplicationsByProperty(
    @Param('identifier') identifier: any,
    @Query('applicationIdentifier') applicationIdentifier: string,
    @Query('env') env: string,
    @Query('isContainerized') isContainerized: boolean,
    @Query('isGit') isGit: boolean,
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ) {
    return this.applicationService.getApplicationsByProperty(identifier, applicationIdentifier, env, isContainerized, isGit, skip, limit);
  }

  @Post('/deploy/:propertyIdentifier/:env')
  @UseInterceptors(
    FileInterceptor('upload', {
      dest: DIRECTORY_CONFIGURATION.baseDir,
      storage: diskStorage({
        destination: DIRECTORY_CONFIGURATION.baseDir,
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname.replace(VALIDATION.FILE, '_')}`);
        }
      }),
      fileFilter: (req, file, cb) => {
        file.filename = `${Date.now()}-${file.originalname.replace(VALIDATION.FILE, '_')}`;
        cb(null, true);
      }
    })
  )
  @ApiCreatedResponse({ status: 201, description: 'Application deployed successfully.', type: ApplicationResponse })
  async createApplication(@UploadedFile() file, @Body() applicationDto: CreateApplicationDto, @Param() params, @Query() queries): Promise<any> {
    if (!this.applicationFactory.getIdentifier(applicationDto.name))
      this.exceptionService.badRequestException({ message: 'Please provide a valid name.' });
    // @internal `imageUrl` refers to the Containerized Deployment
    if (applicationDto.imageUrl) {
      await this.applicationService.validateImageRegistry(applicationDto.imageUrl);
      await this.applicationService.validatePropertyAndEnvironment(params.propertyIdentifier, params.env);
      return this.applicationService.saveContainerizedApplication(applicationDto, params.propertyIdentifier, params.env);
    }
    // @internal `repoUrl` refers to the Git Enabled Deployment
    if (applicationDto.repoUrl) {
      await this.applicationService.validateGitProps(applicationDto.repoUrl, applicationDto.gitRef, applicationDto.contextDir);
      await this.applicationService.validatePropertyAndEnvironment(params.propertyIdentifier, params.env);
      await this.applicationService.validateExistingGitDeployment(
        applicationDto.repoUrl,
        applicationDto.contextDir,
        params.propertyIdentifier,
        this.applicationFactory.getContainerizedApplicationIdentifier(applicationDto.name)
      );
      return this.applicationService.saveGitApplication(applicationDto, params.propertyIdentifier, params.env);
    }
    // @internal deploy the Static Distribution
    const types = ['zip', 'tgz', 'gzip', 'gz', 'bzip2', 'bzip', '7z', 'rar', 'tar'];
    if (!file?.originalname) this.exceptionService.badRequestException({ message: 'Please provide a valid file for the deployment.' });
    const fileFilter = file?.originalname.split('.');
    if (!types.includes(fileFilter[fileFilter.length - 1])) this.exceptionService.badRequestException({ message: 'Invalid file type.' });
    this.applicationFactory.validateEphemeralRequestForDuration(applicationDto);
    const application = this.applicationService.saveApplication(
      applicationDto,
      file.originalname,
      file.path,
      params.propertyIdentifier,
      params.env,
      queries.createdBy
    );
    return application;
  }

  @Post('/config')
  @ApiOperation({ description: 'Save the Config for the Application.' })
  async saveConfig(@Body() applicationConfigDto: ApplicationConfigDTO) {
    await this.applicationService.validatePropertyAndEnvironment(applicationConfigDto.propertyIdentifier, applicationConfigDto.env);
    return this.applicationService.saveConfig(applicationConfigDto);
  }

  @Post('/git/deploy')
  @ApiOperation({ description: 'Start the Deployment process for Application on Git Config.' })
  async saveApplicationFromGit(@Body() gitRequestDTO: GitDeploymentRequestDTO) {
    await this.applicationService.validateGitProps(gitRequestDTO.repoUrl, gitRequestDTO.gitRef, gitRequestDTO.contextDir);
    return this.applicationService.processGitRequest(gitRequestDTO);
  }

  @Post('/git/validate')
  @ApiOperation({ description: 'Validate the Git Repository and Dockerfile.' })
  async validateGitCredentials(@Body() gitRequestDTO: GitValidationRequestDTO) {
    await this.applicationService.validateGitProps(gitRequestDTO.repoUrl, gitRequestDTO.gitRef, gitRequestDTO.contextDir);
    if (gitRequestDTO.propertyIdentifier && gitRequestDTO.identifier)
      await this.applicationService.validateExistingGitDeployment(
        gitRequestDTO.repoUrl,
        gitRequestDTO.contextDir,
        gitRequestDTO.propertyIdentifier,
        gitRequestDTO.identifier
      );
    return this.applicationFactory.extractDockerProps(gitRequestDTO);
  }

  @Get('/log/:propertyIdentifier/:env/:identifier')
  @ApiOperation({ description: 'Get the Build, Deployment & Pod logs.' })
  async getLogs(
    @Param('propertyIdentifier') propertyIdentifier: string,
    @Param('env') env: string,
    @Param('identifier') identifier: string,
    @Query('lines') lines: string,
    @Query('type') type: string,
    @Query('id') id: string,
    @Query('cluster') cluster: string,
    @Query('deploymentType') deploymentType: string
  ): Promise<String> {
    return this.applicationService.getLogs(propertyIdentifier, env, identifier, lines, type, id, cluster, deploymentType);
  }

  @Get('/status')
  @ApiOperation({ description: 'Check the status of the application.' })
  async checkApplicationStatus(@Query('accessUrl') accessUrl: string) {
    return this.applicationService.checkApplicationStatus(accessUrl);
  }

  @Get('/pods/:propertyIdentifier/:env/:identifier')
  @ApiOperation({ description: 'Get the List of the Pods.' })
  async getListOfPods(
    @Param('propertyIdentifier') propertyIdentifier: string,
    @Param('env') env: string,
    @Param('identifier') identifier: string,
    @Query('deploymentType') deploymentType: string
  ): Promise<String[]> {
    return this.applicationService.getListOfPods(propertyIdentifier, env, identifier, deploymentType);
  }

  @Post('/sync')
  @ApiOperation({ description: 'Enable Auto Sync for Applications.' })
  async enableApplicationAutoSync(@Body() enableApplicationSyncDTO: EnableApplicationSyncDTO): Promise<Application> {
    return this.applicationService.enableApplicationAutoSync(enableApplicationSyncDTO);
  }

  @Delete()
  @ApiOperation({ description: 'Delete the Specific Application.' })
  async deleteApplication(@Body() deleteApplicationSyncDTO: DeleteApplicationSyncDTO): Promise<Application> {
    return this.applicationService.deleteApplication(deleteApplicationSyncDTO);
  }

  @Post('/symlink')
  @ApiOperation({ description: 'Symlink Environment Creation or Updation.' })
  async saveSymlink(@Body() symlinkDTO: SymlinkDTO): Promise<any> {
    return this.applicationService.saveSymlink(symlinkDTO);
  }

  @Delete('/symlink')
  @ApiOperation({ description: 'Symlink Environment Deletion.' })
  async deleteSymlink(@Body() symlinkDTO: SymlinkDTO): Promise<any> {
    return this.applicationService.deleteSymlink(symlinkDTO);
  }

  @Post('/auto-symlink')
  @ApiOperation({ description: 'Symlink Environment.' })
  async autoSymlinkCreation(@Body() symlinkDTO: SymlinkDTO): Promise<any> {
    return this.applicationService.autoSymlinkCreation(symlinkDTO);
  }
}
