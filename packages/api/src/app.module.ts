import { Module } from '@nestjs/common';
import { LoggerModule } from './configuration/logger/module';
import { DataServicesModule } from './repository/data-services.module';
import { AgendaModule } from './server/agenda/service/module';
import { AnalyticsController } from './server/analytics/controller';
import { AnalyticsModule } from './server/analytics/service/module';
import { ApikeyController } from './server/api-key/controller';
import { ApikeyModule } from './server/api-key/service/module';
import { ApplicationController } from './server/application/controller';
import { ApplicationModule } from './server/application/service/module';
import { AuthActionLookupController } from './server/auth-action-lookup/controller';
import { AuthActionLookupModule } from './server/auth-action-lookup/service/module';
import { AuthModule } from './server/auth/module';
import { DeploymentConnectionController } from './server/deployment-connection/controller';
import { DeploymentConnectionModule } from './server/deployment-connection/service/module';
import { DocumentationController } from './server/document/controller';
import { DocumentationModule } from './server/document/service/module';
import { EnvironmentController } from './server/environment/controller';
import { EnvironmentModule } from './server/environment/service/module';
import { EventModule } from './server/event/service/module';
import { ExceptionsModule } from './server/exceptions/module';
import { FeedbackController } from './server/feedback/controller';
import { FeedbackModule } from './server/feedback/service/module';
import { HealthController } from './server/health/controller';
import { HealthModule } from './server/health/service/module';
import { LighthouseController } from './server/lighthouse/controller';
import { LighthouseModule } from './server/lighthouse/service/module';
import { PermissionController } from './server/permission/controller';
import { PermissionModule } from './server/permission/service/module';
import { PropertyController } from './server/property/controller';
import { PropertyModule } from './server/property/service/module';
import { ReportController } from './server/report/controller';
import { ReportModule } from './server/report/service/module';
import { RoleController } from './server/role/controller';
import { RoleModule } from './server/role/service/module';
import { CMDBController } from './server/sot/cmdb/controller';
import { CMDBModule } from './server/sot/cmdb/service/module';
import { RoverController } from './server/sot/rover/controller';
import { RoverModule } from './server/sot/rover/service/module';
import { WebhookController } from './server/webhook/controller';
import { WebhookModule } from './server/webhook/service/module';
import { ProxyModule } from './server/proxy/service/module';
import { ProxyController } from './server/proxy/controller';

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
    CMDBModule,
    LighthouseModule,
    FeedbackModule,
    ReportModule,
    ProxyModule
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
    CMDBController,
    LighthouseController,
    FeedbackController,
    ReportController,
    ProxyController
  ],
  providers: []
})
export class AppModule {}
