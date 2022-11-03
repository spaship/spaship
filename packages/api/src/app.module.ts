import { Module } from '@nestjs/common';
import { LoggerModule } from './configuration/logger/logger.module';
import { DataServicesModule } from './repository/data-services.module';
import { ApikeyController } from './server/api-key/apikey.controller';
import { ApikeyUseCasesModule } from './server/api-key/service/apikey.module';
import { ApplicationController } from './server/application/application.controller';
import { ApplicationUseCasesModule } from './server/application/service/application.module';
import { AuthModule } from './server/auth/service/auth.module';
import { DeploymentConnectionController } from './server/deployment-conncetion/deployment-connection.controller';
import { DeploymentConnectionUseCasesModule } from './server/deployment-conncetion/service/deployment-connection.module';
import { ExceptionsModule } from './server/exceptions/exceptions.module';
import { PropertyController } from './server/property/property.controller';
import { PropertyUseCasesModule } from './server/property/service/property.module';
import { SSEConsumeModule } from './server/sse-services/service/sse-consume.module';

@Module({
  imports: [
    AuthModule,
    DataServicesModule,
    LoggerModule,
    ExceptionsModule,
    ApplicationUseCasesModule,
    ApikeyUseCasesModule,
    DeploymentConnectionUseCasesModule,
    PropertyUseCasesModule,
    SSEConsumeModule
  ],
  controllers: [ApplicationController, ApikeyController, DeploymentConnectionController, PropertyController],
  providers: []
})
export class AppModule {}
