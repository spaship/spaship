import { Injectable } from "@nestjs/common";
import { IDataServices } from "../../core/abstracts";
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from "../../core/dtos";
import { DeploymentConnection } from "../../core/entities";
import { DeploymentConnectionFactoryService } from "./deployment-connection.factory";

@Injectable()
export class DeploymentConnectionUseCases {
  constructor(
    private dataServices: IDataServices,
    private deploymentConnectionFactoryService: DeploymentConnectionFactoryService
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
    const deploymentRecord =
      this.deploymentConnectionFactoryService.updateDeploymentConnection(updateDeploymentConnectionDTO);
    return this.dataServices.deploymentConnection.update(deploymentConnectionId, deploymentRecord);
  }
}
