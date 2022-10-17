import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { CreateApikeyDto, DeploymentConnectionDTO, UpdateApikeyDto } from "../core/dtos";
import { DeploymentConnectionUseCases } from "../use-cases/deploymentConnection/deployment-connection.use-case";

@Controller("deployment-connection")
export class DeploymentConnectionController {
  constructor(private deploymentConnectionUseCases: DeploymentConnectionUseCases) {}

  @Get()
  async getAll() {
    return this.deploymentConnectionUseCases.getAllRecords();
  }

  // @Get(':id')
  // async getById(@Param('id') id: any) {
  //   return this.deploymentConnectionUseCases.getApikeyById(id);
  // }

  @Post()
  createApikey(@Body() req: DeploymentConnectionDTO) {
    return this.deploymentConnectionUseCases.createDeploymentConnection(req);
  }

  // @Put(':id')
  // updateApikey(
  //   @Param('id') apikeyId: string,
  //   @Body() updateApikeyDto: UpdateApikeyDto,
  // ) {
  //   return this.deploymentConnectionUseCases.updateApikey(apikeyId, updateApikeyDto);
  // }
}
