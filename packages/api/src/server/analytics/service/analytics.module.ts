import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { AnalyticsFactory } from './analytics.factory';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [AnalyticsService, AnalyticsFactory, LoggerService, ExceptionsService],
  exports: [AnalyticsService, AnalyticsFactory]
})
export class AnalyticsModule {}
