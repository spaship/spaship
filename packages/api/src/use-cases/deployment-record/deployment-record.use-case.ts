import { Injectable } from "@nestjs/common";
import { DeploymentRecord } from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import { CreateDeploymentRecordDto, UpdateDeploymentRecordDto } from "../../core/dtos";
import { DeploymentRecordFactoryService } from "./deployment-record.service";

@Injectable()
export class DeploymentRecordUseCases {
  constructor(
    private dataServices: IDataServices,
    private deploymentRecordFactoryService: DeploymentRecordFactoryService
  ) {}

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
