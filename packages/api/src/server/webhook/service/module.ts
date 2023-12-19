import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { WebhookFactory } from './factory';
import { WebhookService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [WebhookService, WebhookFactory, ExceptionsService, LoggerService, ExceptionsService, AnalyticsService, AnalyticsFactory],
  exports: [WebhookService, WebhookFactory]
})
export class WebhookModule {}
