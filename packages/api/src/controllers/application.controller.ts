import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Application } from "src/core";
import { LoggerService } from "src/core/logger/logger.service";
import { ExceptionsService } from "src/services/exceptions/exceptions.service";
import { CreateApplicationDto, UpdateApplicationDto } from "../core/dtos";
import { ApplicationUseCases, ApplicationFactoryService } from "../use-cases/application";

@Controller("application")
export class ApplicationController {
  constructor(
    private applicationUseCases: ApplicationUseCases,
    private applicationFactoryService: ApplicationFactoryService,
    private loggerService: LoggerService,
    private exceptionService: ExceptionsService
  ) { }

  @Get()
  @ApiOperation({ description: "Get the list of all the SPAs" })
  async getAll() {
    return this.applicationUseCases.getAllApplications();
  }

  @Get(":id")
  async getById(@Param("id") id: any) {
    return this.applicationUseCases.getApplicationById(id);
  }

  @Post("/deploy")
  async createApplication(@Body() applicationDto: CreateApplicationDto): Promise<CreateApplicationDto> {
    this.loggerService.log("applicationDto", JSON.stringify(applicationDto));
    const createApplicationResponse = new CreateApplicationDto();
    const application = this.applicationFactoryService.createNewApplication(createApplicationResponse);
    await this.applicationUseCases.createApplication(application);
    return new CreateApplicationDto();
  }

  @Put(":id")
  updateApplication(@Param("id") applicationId: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    const application = this.applicationFactoryService.updateApplication(updateApplicationDto);
    return this.applicationUseCases.updateApplication(applicationId, application);
  }
}
