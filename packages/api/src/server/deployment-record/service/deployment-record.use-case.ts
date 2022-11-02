import { Injectable } from '@nestjs/common';
import { CreateDeploymentRecordDto, UpdateDeploymentRecordDto } from 'src/server/deployment-record/deploymenet-record.dto';
import { DeploymentRecord } from 'src/repository/mongo/model';
import { IDataServices } from 'src/repository/data-services.abstract';
import { DeploymentRecordFactoryService } from './deployment-record.service';

@Injectable()
export class DeploymentRecordUseCases {
  constructor(private dataServices: IDataServices, private deploymentRecordFactoryService: DeploymentRecordFactoryService) {}

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

  updateDeploymentRecord(deploymentRecordId: string, updateDeploymentRecordDto: UpdateDeploymentRecordDto): Promise<DeploymentRecord> {
    const deploymentRecord = this.deploymentRecordFactoryService.updateDeploymentRecord(updateDeploymentRecordDto);
    return this.dataServices.deploymentRecord.update(deploymentRecordId, deploymentRecord);
  }
}
