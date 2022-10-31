import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { DeploymentRecordUseCases } from "./service/deployment-record.use-case";
import { CreateDeploymentRecordDto, UpdateDeploymentRecordDto } from "./deploymenet-record.dto";

@Controller("deployment-record")
export class DeploymentRecordController {
  constructor(private deploymentRecordUseCases: DeploymentRecordUseCases) {}

  @Get()
  async getAll() {
    return this.deploymentRecordUseCases.getAllDeploymentRecords();
  }

  @Get(":id")
  async getById(@Param("id") id: any) {
    return this.deploymentRecordUseCases.getDeploymentRecordById(id);
  }

  @Post()
  createDeploymentRecord(@Body() deploymentRecordDto: CreateDeploymentRecordDto) {
    return this.deploymentRecordUseCases.createDeploymentRecord(deploymentRecordDto);
  }

  @Put(":id")
  updateDeploymentRecord(
    @Param("id") deploymentRecordId: string,
    @Body() updateDeploymentRecordDto: UpdateDeploymentRecordDto
  ) {
    return this.deploymentRecordUseCases.updateDeploymentRecord(deploymentRecordId, updateDeploymentRecordDto);
  }
}
