import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { AnalyticsFactory } from './analytics.factory';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [DataServicesModule],
  providers: [AnalyticsService, AnalyticsFactory, LoggerService],
  exports: [AnalyticsService, AnalyticsFactory]
})
export class AnalyticsModule {}
