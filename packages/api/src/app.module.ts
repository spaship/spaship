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
import { WebhookModule } from './server/webhook/service/webhook.module';
import { WebhookController } from './server/webhook/service/webhook.controller';
import { RoverModule } from './server/sot/rover/service/rover.module';
import { RoverController } from './server/sot/rover/rover.controller';
import { AuthActionLookupModule } from './server/auth-action-lookup/service/auth-action-lookup.module';
import { AuthActionLookupController } from './server/auth-action-lookup/auth-action-lookup.controller';
import { RoleModule } from './server/role/service/role.module';
import { RoleController } from './server/role/role.controller';
import { PermissionModule } from './server/permission/service/permission.module';
import { PermissionController } from './server/permission/permission.controller';
import { DocumentationModule } from './server/document/service/documentation.module';
import { DocumentationController } from './server/document/documentation.controller';
import { HealthController } from './server/health/health.controller';
import { HealthModule } from './server/health/service/health.module';
import { CMDBModule } from './server/sot/cmdb/service/cmdb.module';
import { CMDBController } from './server/sot/cmdb/cmdb.controller';

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
    AgendaModule,
    WebhookModule,
    RoverModule,
    AuthActionLookupModule,
    RoleModule,
    PermissionModule,
    DocumentationModule,
    HealthModule,
    CMDBModule
  ],
  controllers: [
    ApikeyController,
    ApplicationController,
    AnalyticsController,
    DeploymentConnectionController,
    EnvironmentController,
    PropertyController,
    WebhookController,
    RoverController,
    AuthActionLookupController,
    RoleController,
    PermissionController,
    DocumentationController,
    HealthController,
    CMDBController
  ],
  providers: []
})
export class AppModule {}
