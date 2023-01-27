import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { AnalyticsFactory } from 'src/server/analytics/service/analytics.factory';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { ApikeyFactory } from './apikey.factory';
import { ApikeyService } from './apikey.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [ApikeyFactory, ApikeyService, AnalyticsService, AnalyticsFactory, LoggerService, ExceptionsService],
  exports: [ApikeyFactory, ApikeyService]
})
export class ApikeyModule {}
