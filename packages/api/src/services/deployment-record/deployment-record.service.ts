import { Injectable } from "@nestjs/common";
import { CreateDeploymentRecordDto, UpdateDeploymentRecordDto } from "src/server/deployment-record/deploymenet-record.dto";
import { DeploymentRecord } from "../../core/entities";

@Injectable()
export class DeploymentRecordFactoryService {
  createNewDeploymentRecord(createDeploymentRecordDto: CreateDeploymentRecordDto) {
    const newDeploymentRecord = new DeploymentRecord();
    newDeploymentRecord.propertyName = createDeploymentRecordDto.deploymentConnectionName;
    newDeploymentRecord.deploymentConnectionName = createDeploymentRecordDto.propertyName;
    newDeploymentRecord.type = createDeploymentRecordDto.type;

    return newDeploymentRecord;
  }

  updateDeploymentRecord(updateDeploymentRecordDto: UpdateDeploymentRecordDto) {
    const newDeploymentRecord = new DeploymentRecord();
    newDeploymentRecord.propertyName = updateDeploymentRecordDto.deploymentConnectionName;
    newDeploymentRecord.deploymentConnectionName = updateDeploymentRecordDto.propertyName;
    newDeploymentRecord.type = updateDeploymentRecordDto.type;

    return newDeploymentRecord;
  }
}
