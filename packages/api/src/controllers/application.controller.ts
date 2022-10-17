import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { CreateApplicationDto, UpdateApplicationDto } from "../core/dtos";
import { ApplicationUseCases, ApplicationFactoryService } from "../use-cases/application";

@Controller("api/application")
export class ApplicationController {
  constructor(
    private applicationUseCases: ApplicationUseCases,
    private applicationFactoryService: ApplicationFactoryService
  ) {}

  @Get()
  async getAll() {
    return this.applicationUseCases.getAllApplications();
  }

  @Get(":id")
  async getById(@Param("id") id: any) {
    return this.applicationUseCases.getApplicationById(id);
  }

  @Post()
  async createApplication(@Body() applicationDto: CreateApplicationDto): Promise<CreateApplicationDto> {
    const createApplicationResponse = new CreateApplicationDto();

    return createApplicationResponse;
  }

  @Put(":id")
  updateApplication(@Param("id") applicationId: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    const application = this.applicationFactoryService.updateApplication(updateApplicationDto);
    return this.applicationUseCases.updateApplication(applicationId, application);
  }
}
