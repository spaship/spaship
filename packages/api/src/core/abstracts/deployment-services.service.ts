import { Application } from "../entities";

export abstract class IDeploymentServices {
  abstract deployApplication(application: Application): Promise<Application>;
}
