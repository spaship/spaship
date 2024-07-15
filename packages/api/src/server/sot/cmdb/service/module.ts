import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { ApplicationService } from 'src/server/application/service';
import { ApplicationFactory } from 'src/server/application/service/factory';
import { PropertyService } from 'src/server/property/service';
import { PropertyFactory } from 'src/server/property/service/factory';
import { EnvironmentFactory } from 'src/server/environment/service/factory';
import { EnvironmentService } from 'src/server/environment/service';
import { AgendaService } from 'src/server/agenda/service';
import { PermissionService } from 'src/server/permission/service';
import { PermissionFactory } from 'src/server/permission/service/factory';
import { LighthouseService } from 'src/server/lighthouse/service';
import { LighthouseFactory } from 'src/server/lighthouse/service/factory';
import { CMDBService } from '.';
import { CMDBFactory } from './factory';
import { DataServicesModule } from '../../../../repository/data-services.module';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [
    CMDBService,
    CMDBFactory,
    ExceptionsService,
    LoggerService,
    ExceptionsService,
    AnalyticsFactory,
    AnalyticsService,
    ApplicationService,
    ApplicationFactory,
    ExceptionsService,
    EnvironmentFactory,
    EnvironmentService,
    AgendaService,
    LoggerService,
    PermissionService,
    PermissionFactory,
    CMDBService,
    CMDBFactory,
    LighthouseService,
    LighthouseFactory,
    ApplicationService,
    ApplicationFactory,
    PropertyService,
    PropertyFactory
  ],
  exports: [CMDBService, CMDBFactory]
})
export class CMDBModule {}
