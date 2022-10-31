import { HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import {
  ApikeyController,
  AppController,
  ApplicationController,
  DeploymentConnectionController,
  DeploymentRecordController,
} from "./controllers";
import { PropertyController } from "./controllers/property.controller";
import { LoggerModule } from "./core/logger/logger.module";
import { AuthModule } from "./services/auth/auth.module";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { ExceptionsModule } from "./services/exceptions/exceptions.module";
import { SSEConsumeModule } from "./services/sse-services/sse-consume.module";
import { ApikeyUseCasesModule } from "./services/apikey/apikey.module";
import { ApplicationUseCasesModule } from "./services/application/application.module";
import { DeploymentConnectionUseCasesModule } from "./services/deployment-connection/deployment-connection.module";
import { DeploymentRecordUseCasesModule } from "./services/deployment-record/deployment-record.use-cases.module";
import { PropertyUseCasesModule } from "./services/property/property.module";

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
