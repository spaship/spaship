import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IDataServices } from "../../core";
import { MongoGenericRepository } from "./mongo-generic-repository";
import {
  DeploymentRecord,
  DeploymentRecordDocument,
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
} from "./model";

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  deploymentRecord: MongoGenericRepository<DeploymentRecord>;
  applications: MongoGenericRepository<Application>;
  apikeys: MongoGenericRepository<Apikey>;
  deploymentConnection: MongoGenericRepository<DeploymentConnection>;
  environment: MongoGenericRepository<Environment>;
  event: MongoGenericRepository<Event>;
  eventTimeTrace: MongoGenericRepository<EventTimeTrace>;
  property: MongoGenericRepository<Property>;

  constructor(
    @InjectModel(DeploymentRecord.name)
    private DeploymentRecordRepository: Model<DeploymentRecordDocument>,
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
    private PropertyRepository: Model<PropertyDocument>
  ) {}

  onApplicationBootstrap() {
    this.deploymentRecord = new MongoGenericRepository<DeploymentRecord>(this.DeploymentRecordRepository);
    this.applications = new MongoGenericRepository<Application>(this.ApplicationRepository);
    this.apikeys = new MongoGenericRepository<Apikey>(this.ApikeyRepository);
    this.deploymentConnection = new MongoGenericRepository<DeploymentConnection>(this.DeploymentConnectionRepository);
    this.event = new MongoGenericRepository<Event>(this.EventRepository);
    this.eventTimeTrace = new MongoGenericRepository<EventTimeTrace>(this.EventTimeTraceRepository);
    this.environment = new MongoGenericRepository<Environment>(this.EnvironmentRepository);
    this.property = new MongoGenericRepository<Property>(this.PropertyRepository);
  }
}
