import { DeploymentRecord, Application, Apikey, DeploymentConnection } from "../entities";
import { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
  abstract applications: IGenericRepository<Application>;

  abstract apikeys: IGenericRepository<Apikey>;

  abstract deploymentConnection: IGenericRepository<DeploymentConnection>;

  abstract deploymentRecord: IGenericRepository<DeploymentRecord>;
}
