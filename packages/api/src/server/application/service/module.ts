import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AgendaService } from 'src/server/agenda/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { EnvironmentFactory } from 'src/server/environment/service/factory';
import { EnvironmentService } from 'src/server/environment/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { PermissionFactory } from 'src/server/permission/service/factory';
import { PermissionService } from 'src/server/permission/service';
import { PropertyFactory } from 'src/server/property/service/factory';
import { PropertyService } from 'src/server/property/service';
import { CMDBFactory } from 'src/server/sot/cmdb/service/factory';
import { CMDBService } from 'src/server/sot/cmdb/service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { ApplicationFactory } from './factory';
import { ApplicationService } from '.';

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
