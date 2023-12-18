import { ActivityStream } from 'src/server/analytics/entity';
import { AuthActionLookup } from 'src/server/auth-action-lookup/entity';
import { Documentation } from 'src/server/document/entity';
import { Permission } from 'src/server/permission/entity';
import { Role } from 'src/server/role/entity';
import { Webhook } from 'src/server/webhook/entity';
import { Apikey } from '../server/api-key/entity';
import { Application } from '../server/application/entity';
import { DeploymentConnection } from '../server/deployment-connection/entity';
import { Environment } from '../server/environment/entity';
import { EventTimeTrace } from '../server/event/time-trace.entity';
import { Event } from '../server/event/entity';
import { Property } from '../server/property/entity';
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

  abstract authActionLookup: IGenericRepository<AuthActionLookup>;

  abstract role: IGenericRepository<Role>;

  abstract permission: IGenericRepository<Permission>;

  abstract documentation: IGenericRepository<Documentation>;
}
