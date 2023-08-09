import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { AgendaService } from 'src/server/agenda/agenda.service';
import { AnalyticsFactory } from 'src/server/analytics/service/analytics.factory';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { EnvironmentFactory } from 'src/server/environment/service/environment.factory';
import { EnvironmentService } from 'src/server/environment/service/environment.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { PermissionFactory } from 'src/server/permission/service/permission.factory';
import { PermissionService } from 'src/server/permission/service/permission.service';
import { PropertyFactory } from 'src/server/property/service/property.factory';
import { PropertyService } from 'src/server/property/service/property.service';
import { CMDBFactory } from 'src/server/sot/cmdb/service/cmdb.factory';
import { CMDBService } from 'src/server/sot/cmdb/service/cmdb.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { ApplicationFactory } from './application.factory';
import { ApplicationService } from './application.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [
    ApplicationFactory,
    ApplicationService,
    AnalyticsService,
    AnalyticsFactory,
    LoggerService,
    ExceptionsService,
    AgendaService,
    EnvironmentService,
    EnvironmentFactory,
    PropertyFactory,
    PropertyService,
    PermissionService,
    PermissionFactory,
    CMDBService,
    CMDBFactory
  ],
  exports: [ApplicationFactory, ApplicationService]
})
export class ApplicationModule {}
