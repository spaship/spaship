import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AgendaService } from 'src/server/agenda/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { ApplicationFactory } from 'src/server/application/service/factory';
import { ApplicationService } from 'src/server/application/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { PermissionFactory } from 'src/server/permission/service/factory';
import { PermissionService } from 'src/server/permission/service';
import { PropertyFactory } from 'src/server/property/service/factory';
import { PropertyService } from 'src/server/property/service';
import { CMDBFactory } from 'src/server/sot/cmdb/service/factory';
import { CMDBService } from 'src/server/sot/cmdb/service';
import { LighthouseService } from 'src/server/lighthouse/service';
import { LighthouseFactory } from 'src/server/lighthouse/service/factory';
import { DataServicesModule } from '../../../repository/data-services.module';
import { EnvironmentFactory } from './factory';
import { EnvironmentService } from '.';

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
    CMDBFactory,
    LighthouseService,
    LighthouseFactory
  ],
  exports: [EnvironmentFactory, EnvironmentService]
})
export class EnvironmentModule {}
