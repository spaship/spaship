import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guard';
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from './dto';
import { DeploymentConnectionService } from './service';

@Controller('deployment-connection')
@ApiTags('Deployment Connection')
@UseGuards(AuthenticationGuard)
export class DeploymentConnectionController {
  constructor(private readonly deploymentConnectionService: DeploymentConnectionService) {}

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
