import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { DataServicesModule } from 'src/repository/data-services.module';
import { AnalyticsFactory } from '../analytics/service/analytics.factory';
import { AnalyticsService } from '../analytics/service/analytics.service';
import { ApplicationFactory } from '../application/service/application.factory';
import { ApplicationService } from '../application/service/application.service';
import { EnvironmentFactory } from '../environment/service/environment.factory';
import { EnvironmentService } from '../environment/service/environment.service';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { PropertyFactory } from '../property/service/property.factory';
import { PropertyService } from '../property/service/property.service';
import { AgendaService } from './agenda.service';

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
    PropertyFactory
  ],
  exports: [AgendaService]
})
export class AgendaModule {}
