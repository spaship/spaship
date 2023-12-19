import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AgendaService } from 'src/server/agenda/service';
import { AnalyticsService } from 'src/server/analytics/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { ApplicationService } from 'src/server/application/service';
import { ApplicationFactory } from 'src/server/application/service/factory';
import { EnvironmentService } from 'src/server/environment/service';
import { EnvironmentFactory } from 'src/server/environment/service/factory';
import { ExceptionsService } from 'src/server/exceptions/service';
import { PermissionService } from 'src/server/permission/service';
import { PermissionFactory } from 'src/server/permission/service/factory';
import { PropertyService } from 'src/server/property/service';
import { PropertyFactory } from 'src/server/property/service/factory';
import { CMDBService } from 'src/server/sot/cmdb/service';
import { CMDBFactory } from 'src/server/sot/cmdb/service/factory';
import { LighthouseService } from '.';
import { DataServicesModule } from '../../../repository/data-services.module';
import { LighthouseFactory } from './factory';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [
    LighthouseService,
    LighthouseFactory,
    ExceptionsService,
    LoggerService,
    ApplicationService,
    ApplicationFactory,
    EnvironmentFactory,
    EnvironmentService,
    AgendaService,
    PropertyService,
    PropertyFactory,
    PermissionService,
    PermissionFactory,
    CMDBService,
    CMDBFactory,
    AnalyticsService,
    AnalyticsFactory
  ],
  exports: [LighthouseService, LighthouseFactory]
})
export class LighthouseModule {}
