import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { DataServicesModule } from 'src/repository/data-services.module';
import { AnalyticsFactory } from 'src/server/analytics/service/analytics.factory';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { EventService } from './event.service';

@Module({
  imports: [DataServicesModule],
  providers: [EventModule, EventService, AnalyticsService, AnalyticsFactory, LoggerService],
  exports: [EventModule, EventService]
})
export class EventModule {}
