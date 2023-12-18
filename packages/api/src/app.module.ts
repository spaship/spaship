import { Module } from '@nestjs/common';
import { LoggerModule } from './configuration/logger/module';
import { DataServicesModule } from './repository/data-services.module';
import { ApikeyController } from './server/api-key/controller';
import { ApikeyModule } from './server/api-key/service/module';
import { ApplicationController } from './server/application/controller';
import { ApplicationModule } from './server/application/service/module';
import { AuthModule } from './server/auth/module';
import { DeploymentConnectionController } from './server/deployment-connection/controller';
import { DeploymentConnectionModule } from './server/deployment-connection/service/module';
import { ExceptionsModule } from './server/exceptions/module';
import { PropertyController } from './server/property/controller';
import { PropertyModule } from './server/property/service/module';
import { EventModule } from './server/event/service/module';
import { AnalyticsModule } from './server/analytics/service/module';
import { AnalyticsController } from './server/analytics/controller';
import { EnvironmentModule } from './server/environment/service/module';
import { EnvironmentController } from './server/environment/controller';
import { AgendaModule } from './server/agenda/service/module';
import { WebhookModule } from './server/webhook/service/module';
import { WebhookController } from './server/webhook/controller';
import { RoverModule } from './server/sot/rover/service/module';
import { RoverController } from './server/sot/rover/controller';
import { AuthActionLookupModule } from './server/auth-action-lookup/service/module';
import { AuthActionLookupController } from './server/auth-action-lookup/controller';
import { RoleModule } from './server/role/service/module';
import { RoleController } from './server/role/controller';
import { PermissionModule } from './server/permission/service/module';
import { PermissionController } from './server/permission/controller';
import { DocumentationModule } from './server/document/service/module';
import { DocumentationController } from './server/document/controller';
import { HealthController } from './server/health/controller';
import { HealthModule } from './server/health/service/module';
import { CMDBModule } from './server/sot/cmdb/service/module';
import { CMDBController } from './server/sot/cmdb/controller';

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
