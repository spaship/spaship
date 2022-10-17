import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { LoggerService } from "src/core/logger/logger.service";
import { CreateApplicationDto, UpdateApplicationDto } from "../core/dtos";
import { ApplicationUseCases, ApplicationFactoryService } from "../use-cases/application";

@Controller("application")
export class ApplicationController {
  constructor(
    private applicationUseCases: ApplicationUseCases,
    private applicationFactoryService: ApplicationFactoryService,
    private loggerService: LoggerService
  ) { }

  @Get()
  async getAll() {
    return this.applicationUseCases.getAllApplications();
  }

  @Get(":id")
  async getById(@Param("id") id: any) {
    return this.applicationUseCases.getApplicationById(id);
  }

  @Post("/deploy")
  async createApplication(@Body() applicationDto: CreateApplicationDto) {
    this.loggerService.log("applicationDto", JSON.stringify(applicationDto));
    const createApplicationResponse = new CreateApplicationDto();
    const application = this.applicationFactoryService.createNewApplication(createApplicationResponse);
    return this.applicationUseCases.createApplication(application);
  }

  @Put(":id")
  updateApplication(@Param("id") applicationId: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    const application = this.applicationFactoryService.updateApplication(updateApplicationDto);
    return this.applicationUseCases.updateApplication(applicationId, application);
  }
}
