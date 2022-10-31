import { Injectable } from "@nestjs/common";
import { IDataServices } from "../../../core/abstracts";
import { DeploymentRecordFactoryService } from "./deployment-record.service";
import { CreateDeploymentRecordDto, UpdateDeploymentRecordDto } from "src/server/deployment-record/deploymenet-record.dto";
import { DeploymentRecord } from "src/repository/mongo/model";

@Injectable()
export class DeploymentRecordUseCases {
  constructor(
    private dataServices: IDataServices,
    private deploymentRecordFactoryService: DeploymentRecordFactoryService
  ) { }

  getAllDeploymentRecords(): Promise<DeploymentRecord[]> {
    return this.dataServices.deploymentRecord.getAll();
  }

  getDeploymentRecordById(id: any): Promise<DeploymentRecord> {
    return this.dataServices.deploymentRecord.get(id);
  }

  createDeploymentRecord(createDeploymentRecordDto: CreateDeploymentRecordDto): Promise<DeploymentRecord> {
    const deploymentRecord = this.deploymentRecordFactoryService.createNewDeploymentRecord(createDeploymentRecordDto);
    return this.dataServices.deploymentRecord.create(deploymentRecord);
  }

  updateDeploymentRecord(
    deploymentRecordId: string,
    updateDeploymentRecordDto: UpdateDeploymentRecordDto
  ): Promise<DeploymentRecord> {
    const deploymentRecord = this.deploymentRecordFactoryService.updateDeploymentRecord(updateDeploymentRecordDto);
    return this.dataServices.deploymentRecord.update(deploymentRecordId, deploymentRecord);
  }
}
