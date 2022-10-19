import {
  DeploymentRecord,
  Application,
  Property,
  Apikey,
  DeploymentConnection,
  Environment,
  Event,
  EventTimeTrace,
} from "../entities";
import { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
  abstract applications: IGenericRepository<Application>;

  abstract apikeys: IGenericRepository<Apikey>;

  abstract deploymentConnection: IGenericRepository<DeploymentConnection>;

  abstract deploymentRecord: IGenericRepository<DeploymentRecord>;

  abstract environment: IGenericRepository<Environment>;

  abstract event: IGenericRepository<Event>;

  abstract eventTimeTrace: IGenericRepository<EventTimeTrace>;

  abstract property: IGenericRepository<Property>;
}
