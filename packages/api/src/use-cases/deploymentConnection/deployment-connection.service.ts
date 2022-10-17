import { log } from "@spaship/common/lib/logging/pino";
import { Injectable } from "@nestjs/common";
import { DeploymentRecord, DeploymentConnection } from "../../core/entities";
import { DeploymentConnectionDTO } from "../../core/dtos";

@Injectable()
export class DeploymentConnectionFactoryService {
  createNewDeploymentConnection(res: DeploymentConnectionDTO) {
    const obj = new DeploymentConnection();
    obj.name = res.name;
    obj.baseurl = res.baseurl;
    obj.alias = res.alias;
    obj.type = res.type;
    obj.isActive = true;
    log.info(obj.toString());
    return obj;
  }
}
