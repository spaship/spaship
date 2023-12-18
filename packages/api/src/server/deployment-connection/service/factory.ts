import { Injectable } from '@nestjs/common';
import { DeploymentConnection } from 'src/repository/mongo/model';
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from 'src/server/deployment-connection/dto';

@Injectable()
export class DeploymentConnectionFactoryService {
  createNewDeploymentConnection(res: DeploymentConnectionDTO) {
    const obj = new DeploymentConnection();
    obj.name = res.name;
    obj.baseurl = res.baseurl;
    obj.cluster = res.cluster;
    obj.isActive = true;
    return obj;
  }

  updateDeploymentConnection(res: UpdateDeploymentConnectionDTO) {
    const obj = new DeploymentConnection();
    obj.baseurl = res.baseurl;
    obj.cluster = res.cluster;
    return obj;
  }
}
