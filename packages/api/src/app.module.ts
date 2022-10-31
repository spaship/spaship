import { HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { PropertyController } from "./server/property/property.controller";
import { LoggerModule } from "./configuration/logger/logger.module";
import { AuthModule } from "./server/auth/service/auth.module";
import { DataServicesModule } from "./repository/data-services.module";
import { ExceptionsModule } from "./configuration/exceptions/exceptions.module";
import { ApikeyUseCasesModule } from "./server/api-key/service/apikey.module";
import { ApplicationUseCasesModule } from "./server/application/service/application.module";
import { DeploymentConnectionUseCasesModule } from "./server/deployment-conncetion/service/deployment-connection.module";
import { DeploymentRecordUseCasesModule } from "./server/deployment-record/service/deployment-record.use-cases.module";
import { PropertyUseCasesModule } from "./server/property/service/property.module";
import { SSEConsumeModule } from "./server/sse-services/service/sse-consume.module";
import { DeploymentConnectionController } from "./server/deployment-conncetion/deployment-connection.controller";
import { ApikeyController } from "./server/api-key/apikey.controller";
import { DeploymentRecordController } from "./server/deployment-record/deployment-record.controller";
import { ApplicationController } from "./server/application/application.controller";

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
    ApplicationController,
    DeploymentRecordController,
    ApikeyController,
    DeploymentConnectionController,
    PropertyController,
  ],
  providers: [],
})
export class AppModule {}
