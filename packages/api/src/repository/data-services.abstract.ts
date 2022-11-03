import { Apikey } from '../server/api-key/apikey.entity';
import { Application } from '../server/application/application.entity';
import { DeploymentConnection } from '../server/deployment-conncetion/deployment-connection.entity';
import { Environment } from '../server/property/environment.entity';
import { EventTimeTrace } from '../server/sse-services/event-time-trace.entity';
import { Event } from '../server/sse-services/event.entity';
import { Property } from '../server/property/property.entity';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract applications: IGenericRepository<Application>;

  abstract apikeys: IGenericRepository<Apikey>;

  abstract deploymentConnection: IGenericRepository<DeploymentConnection>;

  abstract environment: IGenericRepository<Environment>;

  abstract event: IGenericRepository<Event>;

  abstract eventTimeTrace: IGenericRepository<EventTimeTrace>;

  abstract property: IGenericRepository<Property>;
}
