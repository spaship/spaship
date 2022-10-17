import { Injectable } from "@nestjs/common";
import { IDataServices } from "../../core/abstracts";
import { DeploymentConnectionDTO } from "../../core/dtos";
import { DeploymentConnection } from "../../core/entities";
import { DeploymentConnectionFactoryService } from "./deployment-connection.service";

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

  // updateDeploymentRecord(
  //   deploymentRecordId: string,
  //   updateDeploymentRecordDto: UpdateDeploymentRecordDto,
  // ): Promise<DeploymentRecord> {
  //   const deploymentRecord = this.deploymentRecordFactoryService.updateDeploymentRecord(updateDeploymentRecordDto);
  //   return this.dataServices.DeploymentRecord.update(deploymentRecordId, deploymentRecord);
  // }
}
