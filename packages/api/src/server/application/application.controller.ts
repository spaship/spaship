import { Controller, Get, Param, Post, Body, Put, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { LoggerService } from "src/configuration/logger/logger.service";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { CreateApplicationDto, UpdateApplicationDto } from "./application.dto";
import { ApplicationFactoryService } from "./service/application.factory";
import { ApplicationService } from "./service/application.service";

@Controller("application")
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private loggerService: LoggerService
  ) { }

  @Get()
  @ApiOperation({ description: "Get the list of all the SPAs" })
  async getAll() {
    return this.applicationService.getAllApplications();
  }

  @Get(":id")
  async getById(@Param("id") id: any) {
    return this.applicationService.getApplicationById(id);
  }

  @Post("/deploy")
  @UseInterceptors(
    FileInterceptor('upload', {
      dest: './spaship_uploads',
      fileFilter: (req, file, cb) => {
        file.filename = `${Date.now()  }-${  file.originalname}`;
        cb(null, true);
      },
    }),
  )
  async createApplication(@UploadedFile() file, @Body() applicationDto: any): Promise<any> {
    const application = this.applicationService.deployApplication(applicationDto, file);
    return [];
  }

  @Put(":id")
  updateApplication(@Param("id") applicationId: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return {};
  }
}
