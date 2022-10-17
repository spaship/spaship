import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IDataServices } from "../../../core";
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
} from "./model";

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  deploymentRecord: MongoGenericRepository<DeploymentRecord>;
  applications: MongoGenericRepository<Application>;
  apikeys: MongoGenericRepository<Apikey>;
  deploymentConnection: MongoGenericRepository<DeploymentConnection>;

  constructor(
    @InjectModel(DeploymentRecord.name)
    private DeploymentRecordRepository: Model<DeploymentRecordDocument>,
    @InjectModel(Application.name)
    private ApplicationRepository: Model<ApplicationDocument>,
    @InjectModel(Apikey.name)
    private ApikeyRepository: Model<ApikeyDocument>,
    @InjectModel(DeploymentConnection.name)
    private DeploymentConnectionRepository: Model<DeploymentConnectionDocument>
  ) {}

  onApplicationBootstrap() {
    this.deploymentRecord = new MongoGenericRepository<DeploymentRecord>(this.DeploymentRecordRepository);
    this.applications = new MongoGenericRepository<Application>(this.ApplicationRepository);
    this.apikeys = new MongoGenericRepository<Apikey>(this.ApikeyRepository);
    this.deploymentConnection = new MongoGenericRepository<DeploymentConnection>(this.DeploymentConnectionRepository);
  }
}
