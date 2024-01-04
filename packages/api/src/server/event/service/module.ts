import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { DataServicesModule } from 'src/repository/data-services.module';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { LighthouseFactory } from 'src/server/lighthouse/service/factory';
import { LighthouseService } from 'src/server/lighthouse/service';
import { EventService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [EventModule, EventService, AnalyticsService, AnalyticsFactory, LoggerService, ExceptionsService, LighthouseService, LighthouseFactory],
  exports: [EventModule, EventService]
})
export class EventModule {}
