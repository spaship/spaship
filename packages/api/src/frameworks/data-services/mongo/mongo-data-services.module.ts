import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IDataServices } from "../../../core";
import { DATA_BASE_CONFIGURATION } from "../../../configuration";
import {
  DeploymentRecord,
  DeploymentRecordSchema,
  Application,
  ApplicationSchema,
  DeploymentConnection,
  DeploymentConnectionSchema,
  Apikey,
  ApikeySchema,
} from "./model";
import { MongoDataServices } from "./mongo-data-services.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeploymentRecord.name, schema: DeploymentRecordSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Apikey.name, schema: ApikeySchema },
      { name: DeploymentConnection.name, schema: DeploymentConnectionSchema },
    ]),
    MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
