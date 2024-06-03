import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/repository/data-services.module';
import { HttpModule } from '@nestjs/axios';
import { ApplicationService } from 'src/server/application/service';
import { ApplicationFactory } from 'src/server/application/service/factory';
import { ExceptionsService } from 'src/server/exceptions/service';
import { EnvironmentFactory } from 'src/server/environment/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { LoggerService } from 'src/configuration/logger/service';
import { LighthouseService } from 'src/server/lighthouse/service';
import { LighthouseFactory } from 'src/server/lighthouse/service/factory';
import { PropertyService } from 'src/server/property/service';
import { PropertyFactory } from 'src/server/property/service/factory';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { EnvironmentService } from 'src/server/environment/service';
import { AgendaService } from 'src/server/agenda/service';
import { PermissionService } from 'src/server/permission/service';
import { PermissionFactory } from 'src/server/permission/service/factory';
import { CMDBService } from 'src/server/sot/cmdb/service';
import { CMDBFactory } from 'src/server/sot/cmdb/service/factory';
import { ReportService } from '.';
import { ReportFactory } from './factory';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [
    ReportService,
    ReportFactory,
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
  exports: [ReportService, ReportFactory]
})
export class ReportModule {}
