import { Injectable } from "@nestjs/common";
import { DeploymentConnectionDTO, UpdateDeploymentConnectionDTO } from "../../core/dtos";
import { DeploymentConnection } from "../../core/entities";

@Injectable()
export class DeploymentConnectionFactoryService {
  createNewDeploymentConnection(res: DeploymentConnectionDTO) {
    const obj = new DeploymentConnection();
    obj.name = res.name;
    obj.baseurl = res.baseurl;
    obj.alias = res.alias;
    obj.type = res.type;
    obj.isActive = true;
    return obj;
  }

  updateDeploymentConnection(res: UpdateDeploymentConnectionDTO) {
    const obj = new DeploymentConnection();
    obj.baseurl = res.baseurl;
    obj.type = res.type;
    return obj;
  }
}
