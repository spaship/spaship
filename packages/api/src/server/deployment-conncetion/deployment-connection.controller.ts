import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { DeploymentConnectionUseCases } from './service/deployment-connection.service';
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from './deployment-connection.dto';

@Controller('deployment-connection')
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
