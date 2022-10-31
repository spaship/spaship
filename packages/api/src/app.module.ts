import { HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import {
  ApikeyController,
  AppController,
  ApplicationController,
  DeploymentConnectionController,
  DeploymentRecordController,
} from "./controllers";
import { PropertyController } from "./server/property/property.controller";
import { LoggerModule } from "./configuration/logger/logger.module";
import { AuthModule } from "./services/auth/auth.module";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { ExceptionsModule } from "./configuration/exceptions/exceptions.module";
import { ApikeyUseCasesModule } from "./server/api-key/service/apikey.module";
import { ApplicationUseCasesModule } from "./server/application/service/application.module";
import { DeploymentConnectionUseCasesModule } from "./server/deployment-conncetion/service/deployment-connection.module";
import { DeploymentRecordUseCasesModule } from "./server/deployment-record/service/deployment-record.use-cases.module";
import { PropertyUseCasesModule } from "./server/property/service/property.module";
import { SSEConsumeModule } from "./server/sse-services/sse-consume.module";

@Module({
  imports: [
    AuthModule,
    DataServicesModule,
    LoggerModule,
    ExceptionsModule,
    ApplicationUseCasesModule,
    DeploymentRecordUseCasesModule,
    ApikeyUseCasesModule,
    DeploymentConnectionUseCasesModule,
    PropertyUseCasesModule,
    SSEConsumeModule,

  ],
  controllers: [
    AppController,
    ApplicationController,
    DeploymentRecordController,
    ApikeyController,
    DeploymentConnectionController,
    PropertyController,

  ],
  providers: [],
})
export class AppModule { }
