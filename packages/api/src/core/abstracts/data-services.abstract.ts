import { Apikey } from "../entities/apikey.entity";
import { Application } from "../entities/application.entity";
import { DeploymentConnection } from "../entities/deployment-connection.entity";
import { DeploymentRecord } from "../entities/deployment-record.entity";
import { Environment } from "../entities/environment.entity";
import { EventTimeTrace } from "../entities/event-time-trace.entity";
import { Event } from "../entities/event.entity";
import { Property } from "../entities/property.entity";
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
