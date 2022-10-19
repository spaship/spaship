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
import { ApikeyUseCasesModule } from "./use-cases/apikey/apikey-use-cases.module";
import { ApplicationUseCasesModule } from "./use-cases/application/application-use-cases.module";
import { DeploymentConnectionUseCasesModule } from "./use-cases/deployment-connection/deployment-connection-use-cases.module";
import { DeploymentRecordUseCasesModule } from "./use-cases/deployment-record/deployment-record.use-cases.module";
import { PropertyUseCasesModule } from "./use-cases/property/property-use-cases.module";

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
  providers: [SSEConsumeModule],
})
export class AppModule {}
