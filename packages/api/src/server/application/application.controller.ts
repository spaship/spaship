import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DIRECTORY_CONFIGURATION } from '../../configuration';
import { CreateApplicationDto } from './application.dto';
import { ApplicationService } from './service/application.service';

@Controller('application')
@ApiTags('Application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('/property/:identifier')
  @ApiOperation({ description: 'Get the list of Properties.' })
  async getApplicationsByProperty(@Param('identifier') identifier: any) {
    return this.applicationService.getApplicationsByProperty(identifier);
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
  @ApiOperation({ description: 'Deploy an application.' })
  async createApplication(@UploadedFile() file, @Body() applicationDto: CreateApplicationDto, @Param() params): Promise<any> {
    const application = this.applicationService.saveApplication(applicationDto, file.path, params.propertyIdentifier, params.env);
    return application;
  }
}
