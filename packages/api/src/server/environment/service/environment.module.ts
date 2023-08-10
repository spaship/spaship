import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { AgendaService } from 'src/server/agenda/agenda.service';
import { AnalyticsFactory } from 'src/server/analytics/service/analytics.factory';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ApplicationFactory } from 'src/server/application/service/application.factory';
import { ApplicationService } from 'src/server/application/service/application.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { PermissionFactory } from 'src/server/permission/service/permission.factory';
import { PermissionService } from 'src/server/permission/service/permission.service';
import { PropertyFactory } from 'src/server/property/service/property.factory';
import { PropertyService } from 'src/server/property/service/property.service';
import { CMDBFactory } from 'src/server/sot/cmdb/service/cmdb.factory';
import { CMDBService } from 'src/server/sot/cmdb/service/cmdb.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { EnvironmentFactory } from './environment.factory';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [
    EnvironmentFactory,
    EnvironmentService,
    PropertyFactory,
    PropertyService,
    ApplicationService,
    ApplicationFactory,
    AnalyticsService,
    AnalyticsFactory,
    ExceptionsService,
    AgendaService,
    LoggerService,
    PermissionService,
    PermissionFactory,
    CMDBService,
    CMDBFactory
  ],
  exports: [EnvironmentFactory, EnvironmentService]
})
export class EnvironmentModule {}
