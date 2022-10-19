import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { CreateApikeyDto, DeploymentConnectionDTO, UpdateApikeyDto, UpdateDeploymentConnectionDTO } from "../core/dtos";
import { DeploymentConnectionUseCases } from "../use-cases/deploymentConnection/deployment-connection.use-case";

@Controller("deployment-connection")
export class DeploymentConnectionController {
  constructor(private deploymentConnectionUseCases: DeploymentConnectionUseCases) {}

  @Get()
  async getAll() {
    return this.deploymentConnectionUseCases.getAllRecords();
  }

  @Post()
  createDeploymentConnection(@Body() req: DeploymentConnectionDTO) {
    return this.deploymentConnectionUseCases.createDeploymentConnection(req);
  }

  @Put()
  updateApikey(@Body() updateApikeyDto: UpdateDeploymentConnectionDTO) {
    return this.deploymentConnectionUseCases.updateDeploymentRecord(updateApikeyDto._id, updateApikeyDto);
  }
}
