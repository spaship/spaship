import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AgendaService } from 'src/server/agenda/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { ApplicationFactory } from 'src/server/application/service/factory';
import { ApplicationService } from 'src/server/application/service';
import { EnvironmentFactory } from 'src/server/environment/service/factory';
import { EnvironmentService } from 'src/server/environment/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { PermissionFactory } from 'src/server/permission/service/factory';
import { PermissionService } from 'src/server/permission/service';
import { CMDBFactory } from 'src/server/sot/cmdb/service/factory';
import { CMDBService } from 'src/server/sot/cmdb/service';
import { LighthouseService } from 'src/server/lighthouse/service';
import { LighthouseFactory } from 'src/server/lighthouse/service/factory';
import { DataServicesModule } from '../../../repository/data-services.module';
import { PropertyFactory } from './factory';
import { PropertyService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [
    PropertyFactory,
    PropertyService,
    ApplicationService,
    ApplicationFactory,
    AnalyticsService,
    AnalyticsFactory,
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
    LighthouseFactory
  ],
  exports: [PropertyFactory, PropertyService]
})
export class PropertyModule {}
