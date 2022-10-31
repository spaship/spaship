import { Application } from "../entities/application.entity";

export abstract class IDeploymentServices {
  abstract deployApplication(application: Application): Promise<Application>;
}
