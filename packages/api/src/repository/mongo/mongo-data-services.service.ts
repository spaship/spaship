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
  WebhookDocument
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
    private WebhookRepository: Model<WebhookDocument>
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
  }
}
