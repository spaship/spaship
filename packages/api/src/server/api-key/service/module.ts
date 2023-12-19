import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { ApikeyFactory } from './factory';
import { ApikeyService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [ApikeyFactory, ApikeyService, AnalyticsService, AnalyticsFactory, LoggerService, ExceptionsService],
  exports: [ApikeyFactory, ApikeyService]
})
export class ApikeyModule {}
