import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { AgendaService } from 'src/server/agenda/agenda.service';
import { AnalyticsFactory } from 'src/server/analytics/service/analytics.factory';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ApplicationFactory } from 'src/server/application/service/application.factory';
import { ApplicationService } from 'src/server/application/service/application.service';
import { EnvironmentFactory } from 'src/server/environment/service/environment.factory';
import { EnvironmentService } from 'src/server/environment/service/environment.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { PropertyFactory } from './property.factory';
import { PropertyService } from './property.service';

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
    LoggerService
  ],
  exports: [PropertyFactory, PropertyService]
})
export class PropertyModule {}
