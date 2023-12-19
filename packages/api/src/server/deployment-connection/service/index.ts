import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { DeploymentConnection } from 'src/repository/mongo/model';
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from 'src/server/deployment-connection/dto';
import { DeploymentConnectionFactoryService } from './factory';

@Injectable()
export class DeploymentConnectionService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly deploymentConnectionFactoryService: DeploymentConnectionFactoryService
  ) {}

  getAllRecords(): Promise<DeploymentConnection[]> {
    return this.dataServices.deploymentConnection.getAll();
  }

  getDeploymentRecordById(id: any): Promise<DeploymentConnection> {
    return this.dataServices.deploymentConnection.get(id);
  }

  createDeploymentConnection(deploymentConnectionDTO: DeploymentConnectionDTO): Promise<DeploymentConnection> {
    const res = this.deploymentConnectionFactoryService.createNewDeploymentConnection(deploymentConnectionDTO);
    return this.dataServices.deploymentConnection.create(res);
  }

  updateDeploymentRecord(
    deploymentConnectionId: string,
    updateDeploymentConnectionDTO: UpdateDeploymentConnectionDTO
  ): Promise<DeploymentConnection> {
    const deploymentRecord = this.deploymentConnectionFactoryService.updateDeploymentConnection(updateDeploymentConnectionDTO);
    const response = this.dataServices.deploymentConnection.update(deploymentConnectionId, deploymentRecord);
    return response;
  }
}
