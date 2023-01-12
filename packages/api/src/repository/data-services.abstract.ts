import { ActivityStream } from 'src/server/analytics/activity-stream.entity';
import { Webhook } from 'src/server/webhook/webhook.entity';
import { Apikey } from '../server/api-key/apikey.entity';
import { Application } from '../server/application/application.entity';
import { DeploymentConnection } from '../server/deployment-connection/deployment-connection.entity';
import { Environment } from '../server/environment/environment.entity';
import { EventTimeTrace } from '../server/event/event-time-trace.entity';
import { Event } from '../server/event/event.entity';
import { Property } from '../server/property/property.entity';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract application: IGenericRepository<Application>;

  abstract apikey: IGenericRepository<Apikey>;

  abstract deploymentConnection: IGenericRepository<DeploymentConnection>;

  abstract environment: IGenericRepository<Environment>;

  abstract event: IGenericRepository<Event>;

  abstract eventTimeTrace: IGenericRepository<EventTimeTrace>;

  abstract property: IGenericRepository<Property>;

  abstract activityStream: IGenericRepository<ActivityStream>;

  abstract webhook: IGenericRepository<Webhook>;
}
