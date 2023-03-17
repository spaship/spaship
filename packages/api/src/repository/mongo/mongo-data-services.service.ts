import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataServices } from 'src/repository/data-services.abstract';
import { MongoGenericRepository } from './mongo-generic-repository';
import {
  Application,
  ApplicationDocument,
  Apikey,
  ApikeyDocument,
  DeploymentConnection,
  DeploymentConnectionDocument,
  Event,
  EventDocument,
  EventTimeTrace,
  EventTimeTraceDocument,
  Environment,
  EnvironmentDocument,
  Property,
  PropertyDocument,
  ActivityStream,
  ActivityStreamDocument,
  Webhook,
  WebhookDocument,
  AuthActionLookup,
  AuthActionLookupDocument,
  Role,
  RoleDocument,
  Permission,
  PermissionDocument,
  Documentation,
  DocumentationDocument
} from './model';

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  application: MongoGenericRepository<Application>;

  apikey: MongoGenericRepository<Apikey>;

  deploymentConnection: MongoGenericRepository<DeploymentConnection>;

  environment: MongoGenericRepository<Environment>;

  event: MongoGenericRepository<Event>;

  eventTimeTrace: MongoGenericRepository<EventTimeTrace>;

  property: MongoGenericRepository<Property>;

  activityStream: MongoGenericRepository<ActivityStream>;

  webhook: MongoGenericRepository<Webhook>;

  authActionLookup: MongoGenericRepository<AuthActionLookup>;

  role: MongoGenericRepository<Role>;

  permission: MongoGenericRepository<Permission>;

  documentation: MongoGenericRepository<Documentation>;

  constructor(
    @InjectModel(Application.name)
    private ApplicationRepository: Model<ApplicationDocument>,
    @InjectModel(Apikey.name)
    private ApikeyRepository: Model<ApikeyDocument>,
    @InjectModel(DeploymentConnection.name)
    private DeploymentConnectionRepository: Model<DeploymentConnectionDocument>,
    @InjectModel(Environment.name)
    private EnvironmentRepository: Model<EnvironmentDocument>,
    @InjectModel(Event.name)
    private EventRepository: Model<EventDocument>,
    @InjectModel(EventTimeTrace.name)
    private EventTimeTraceRepository: Model<EventTimeTraceDocument>,
    @InjectModel(Property.name)
    private PropertyRepository: Model<PropertyDocument>,
    @InjectModel(ActivityStream.name)
    private ActivityStreamRepository: Model<ActivityStreamDocument>,
    @InjectModel(Webhook.name)
    private WebhookRepository: Model<WebhookDocument>,
    @InjectModel(AuthActionLookup.name)
    private AuthActionLookupRepository: Model<AuthActionLookupDocument>,
    @InjectModel(Role.name)
    private RoleRepository: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private PermissionRepository: Model<PermissionDocument>,
    @InjectModel(Documentation.name)
    private DocumentationRepository: Model<DocumentationDocument>
  ) {}

  onApplicationBootstrap() {
    this.application = new MongoGenericRepository<Application>(this.ApplicationRepository);
    this.apikey = new MongoGenericRepository<Apikey>(this.ApikeyRepository);
    this.deploymentConnection = new MongoGenericRepository<DeploymentConnection>(this.DeploymentConnectionRepository);
    this.event = new MongoGenericRepository<Event>(this.EventRepository);
    this.eventTimeTrace = new MongoGenericRepository<EventTimeTrace>(this.EventTimeTraceRepository);
    this.environment = new MongoGenericRepository<Environment>(this.EnvironmentRepository);
    this.property = new MongoGenericRepository<Property>(this.PropertyRepository);
    this.activityStream = new MongoGenericRepository<ActivityStream>(this.ActivityStreamRepository);
    this.webhook = new MongoGenericRepository<Webhook>(this.WebhookRepository);
    this.authActionLookup = new MongoGenericRepository<AuthActionLookup>(this.AuthActionLookupRepository);
    this.role = new MongoGenericRepository<Role>(this.RoleRepository);
    this.permission = new MongoGenericRepository<Permission>(this.PermissionRepository);
    this.documentation = new MongoGenericRepository<Documentation>(this.DocumentationRepository);
  }
}
