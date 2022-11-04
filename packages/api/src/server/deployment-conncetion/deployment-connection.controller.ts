import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from './deployment-connection.dto';
import { DeploymentConnectionService } from './service/deployment-connection.service';

@Controller('deployment-connection')
export class DeploymentConnectionController {
  constructor(private deploymentConnectionService: DeploymentConnectionService) {}

  @Get()
  async getAll() {
    return this.deploymentConnectionService.getAllRecords();
  }

  @Post()
  createDeploymentConnection(@Body() req: DeploymentConnectionDTO) {
    return this.deploymentConnectionService.createDeploymentConnection(req);
  }

  @Put()
  updateApikey(@Body() updateApikeyDto: UpdateDeploymentConnectionDTO) {
    return this.deploymentConnectionService.updateDeploymentRecord(updateApikeyDto._id, updateApikeyDto);
  }
}
