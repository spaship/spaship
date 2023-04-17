import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DIRECTORY_CONFIGURATION } from '../../configuration';
import { AuthenticationGuard } from '../auth/auth.guard';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { ApplicationConfigDTO, ApplicationResponse, CreateApplicationDto, GitRequestDTO } from './application.dto';
import { ApplicationFactory } from './service/application.factory';
import { ApplicationService } from './service/application.service';

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
    @Query('isSSR') isSSR: boolean,
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ) {
    return this.applicationService.getApplicationsByProperty(identifier, applicationIdentifier, env, isSSR, skip, limit);
  }

  @Post('/deploy/:propertyIdentifier/:env')
  @UseInterceptors(
    FileInterceptor('upload', {
      dest: DIRECTORY_CONFIGURATION.baseDir,
      fileFilter: (req, file, cb) => {
        file.filename = `${Date.now()}-${file.originalname}`;
        cb(null, true);
      }
    })
  )
  @ApiCreatedResponse({ status: 201, description: 'Application deployed successfully.', type: ApplicationResponse })
  async createApplication(@UploadedFile() file, @Body() applicationDto: CreateApplicationDto, @Param() params, @Query() queries): Promise<any> {
    if (!this.applicationFactory.getIdentifier(applicationDto.name))
      this.exceptionService.badRequestException({ message: 'Please provide a valid name.' });
    // @internal `imageUrl` refers to the SSR Enabled Deployment
    if (applicationDto.imageUrl) {
      await this.applicationService.validateImageRegistry(applicationDto.imageUrl);
      await this.applicationService.validatePropertyAndEnvironment(params.propertyIdentifier, params.env);
      return this.applicationService.saveSSRApplication(applicationDto, params.propertyIdentifier, params.env);
    }
    // @internal `repoUrl` refers to the Git Enabled Deployment
    if (applicationDto.repoUrl) {
      // await this.applicationService.validateGitProps(applicationDto);
      await this.applicationService.validatePropertyAndEnvironment(params.propertyIdentifier, params.env);
      return this.applicationService.saveGitApplication(applicationDto, params.propertyIdentifier, params.env);
    }
    // @internal deploy the Static Distribution
    const types = ['zip', 'tgz', 'gzip', 'gz', 'bzip2', 'bzip', '7z', 'rar', 'tar'];
    if (!file?.originalname) this.exceptionService.badRequestException({ message: 'Please provide a valid file for the deployment.' });
    const fileFilter = file?.originalname.split('.');
    if (!types.includes(fileFilter[fileFilter.length - 1])) this.exceptionService.badRequestException({ message: 'Invalid file type.' });
    const application = this.applicationService.saveApplication(applicationDto, file.path, params.propertyIdentifier, params.env, queries.createdBy);
    return application;
  }

  @Post('/config')
  @ApiOperation({ description: 'Save the Config for the Application.' })
  async saveConfig(@Body() applicationConfigDto: ApplicationConfigDTO) {
    await this.applicationService.validatePropertyAndEnvironment(applicationConfigDto.propertyIdentifier, applicationConfigDto.env);
    return this.applicationService.saveConfig(applicationConfigDto);
  }

  @Post('/git/validate')
  @ApiOperation({ description: 'Start the Deployment process for Application on Git Config.' })
  async validateGitCredentials(@Body() gitRequestDTO: GitRequestDTO) {
    return this.applicationService.validateGitProps(gitRequestDTO);
  }
}
