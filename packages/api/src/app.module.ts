import { Module } from '@nestjs/common';
import { LoggerModule } from './configuration/logger/logger.module';
import { DataServicesModule } from './repository/data-services.module';
import { ApikeyController } from './server/api-key/apikey.controller';
import { ApikeyModule } from './server/api-key/service/apikey.module';
import { ApplicationController } from './server/application/application.controller';
import { ApplicationModule } from './server/application/service/application.module';
import { AuthModule } from './server/auth/auth.module';
import { DeploymentConnectionController } from './server/deployment-connection/deployment-connection.controller';
import { DeploymentConnectionModule } from './server/deployment-connection/service/deployment-connection.module';
import { ExceptionsModule } from './server/exceptions/exceptions.module';
import { PropertyController } from './server/property/property.controller';
import { PropertyModule } from './server/property/service/property.module';
import { EventModule } from './server/event/service/event.module';
import { AnalyticsModule } from './server/analytics/service/analytics.module';
import { AnalyticsController } from './server/analytics/analytics.controller';
import { EnvironmentModule } from './server/environment/service/environment.module';
import { EnvironmentController } from './server/environment/environment.controller';
import { AgendaModule } from './server/agenda/agenda.module';

@Module({
  imports: [
    AuthModule,
    DataServicesModule,
    LoggerModule,
    ExceptionsModule,
    ApplicationModule,
    ApikeyModule,
    DeploymentConnectionModule,
    PropertyModule,
    EnvironmentModule,
    EventModule,
    AnalyticsModule,
    AgendaModule
  ],
  controllers: [
    ApikeyController,
    ApplicationController,
    AnalyticsController,
    DeploymentConnectionController,
    EnvironmentController,
    PropertyController
  ],
  providers: []
})
export class AppModule {}
