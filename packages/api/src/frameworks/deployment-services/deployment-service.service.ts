import { Injectable } from "@nestjs/common";
import { Application } from "../../core/entities";
import { IDeploymentServices } from "../../core/abstracts";

@Injectable()
export class DeploymentService implements IDeploymentServices {
  deployApplication(application: Application): Promise<Application> {
    // TODO: Deploy the application into Operator

    return Promise.resolve(application);
  }
}
