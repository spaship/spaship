import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from './deployment-connection.dto';
import { DeploymentConnectionUseCases } from './service/deployment-connection.service';

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
