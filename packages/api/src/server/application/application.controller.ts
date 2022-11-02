import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { LoggerService } from "src/configuration/logger/logger.service";
import { ApplicationService } from "./service/application.service";
import { DIRECTORY_CONFIGURATION } from "../../configuration";

@Controller("application")
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
  ) { }

  @Get("/property/:identifier")
  async getApplicationsByProperty(@Param("identifier") identifier: any) {
    return this.applicationService.getApplicationsByProperty(identifier);
  }

  @Post("/deploy/:propertyIdentifier/:env")
  @UseInterceptors(
    FileInterceptor('upload', {
      dest: DIRECTORY_CONFIGURATION.baseDir,
      fileFilter: (req, file, cb) => {
        file.filename = `${Date.now()}-${file.originalname}`;
        cb(null, true);
      },
    }),
  )
  async createApplication(@UploadedFile() file, @Body() applicationDto: any, @Param() params): Promise<any> {
    const application = this.applicationService.saveApplication(applicationDto, file.path, params.propertyIdentifier, params.env);
    return application;
  }

}
