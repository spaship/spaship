import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IDataServices } from "src/repository/data-services.abstract";
import { DATA_BASE_CONFIGURATION } from "../../configuration";
import {
  DeploymentRecord,
  DeploymentRecordSchema,
  Application,
  ApplicationSchema,
  DeploymentConnection,
  DeploymentConnectionSchema,
  Apikey,
  ApikeySchema,
  Environment,
  EnvironmentSchema,
  Event,
  EventSchema,
  EventTimeTrace,
  EventTimeTraceSchema,
  Property,
  PropertySchema,
} from "./model";
import { MongoDataServices } from "./mongo-data-services.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Apikey.name, schema: ApikeySchema },
      { name: DeploymentConnection.name, schema: DeploymentConnectionSchema },
      { name: DeploymentRecord.name, schema: DeploymentRecordSchema },
      { name: Environment.name, schema: EnvironmentSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventTimeTrace.name, schema: EventTimeTraceSchema },
      { name: Property.name, schema: PropertySchema },
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
