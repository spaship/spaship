import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { DataServicesModule } from 'src/repository/data-services.module';
import { AnalyticsFactory } from '../../analytics/service/factory';
import { AnalyticsService } from '../../analytics/service';
import { ApplicationFactory } from '../../application/service/factory';
import { ApplicationService } from '../../application/service';
import { EnvironmentFactory } from '../../environment/service/factory';
import { EnvironmentService } from '../../environment/service';
import { ExceptionsService } from '../../exceptions/service';
import { PermissionFactory } from '../../permission/service/factory';
import { PermissionService } from '../../permission/service';
import { PropertyFactory } from '../../property/service/factory';
import { PropertyService } from '../../property/service';
import { CMDBFactory } from '../../sot/cmdb/service/factory';
import { CMDBService } from '../../sot/cmdb/service';
import { AgendaService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [
    AgendaService,
    ApplicationFactory,
    ApplicationService,
    EnvironmentFactory,
    EnvironmentService,
    LoggerService,
    ExceptionsService,
    AnalyticsFactory,
    AnalyticsService,
    PropertyService,
    PropertyFactory,
    PermissionService,
    PermissionFactory,
    CMDBService,
    CMDBFactory
  ],
  exports: [AgendaService]
})
export class AgendaModule {}
