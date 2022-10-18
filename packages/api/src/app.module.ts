import { Module } from "@nestjs/common";
import {
  AppController,
  ApplicationController,
  DeploymentRecordController,
  ApikeyController,
  DeploymentConnectionController,
} from "./controllers";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { ApplicationUseCasesModule } from "./use-cases/application/application-use-cases.module";
import { DeploymentRecordUseCasesModule } from "./use-cases/deploymentRecord/deployment-record.use-cases.module";
import { ApikeyUseCasesModule } from "./use-cases/apikey/apikey-use-cases.module";
import { DeployServicesModule } from "./services/deployment-services/deployment-service.module";
import { DeploymentConnectionUseCasesModule } from "./use-cases/deploymentConnection/deployment-connection-use-cases.module";
import { LoggerModule } from "./core/logger/logger.module";
import { ExceptionsModule } from "./services/exceptions/exceptions.module";
import { AuthModule } from "./services/auth/auth.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    AuthModule,
    DataServicesModule,
    LoggerModule,
    ExceptionsModule,
    ApplicationUseCasesModule,
    DeploymentRecordUseCasesModule,
    ApikeyUseCasesModule,
    DeployServicesModule,
    DeploymentConnectionUseCasesModule,
  ],
  controllers: [
    AppController,
    ApplicationController,
    DeploymentRecordController,
    ApikeyController,
    DeploymentConnectionController,
  ],
  providers: [],
})
export class AppModule {}
