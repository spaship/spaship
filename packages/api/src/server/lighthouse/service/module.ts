import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AnalyticsService } from 'src/server/analytics/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { ExceptionsService } from 'src/server/exceptions/service';
import { LighthouseService } from '.';
import { DataServicesModule } from '../../../repository/data-services.module';
import { LighthouseFactory } from './factory';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [LighthouseService, LighthouseFactory, ExceptionsService, LoggerService, AnalyticsService, AnalyticsFactory],
  exports: [LighthouseService, LighthouseFactory]
})
export class LighthouseModule {}
