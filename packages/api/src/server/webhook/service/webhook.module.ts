import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { AnalyticsFactory } from 'src/server/analytics/service/analytics.factory';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { WebhookFactory } from './webhook.factory';
import { WebhookService } from './webhook.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [WebhookService, WebhookFactory, ExceptionsService, LoggerService, ExceptionsService, AnalyticsService, AnalyticsFactory],
  exports: [WebhookService, WebhookFactory]
})
export class WebhookModule {}
