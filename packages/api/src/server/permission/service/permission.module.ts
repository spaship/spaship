import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { AnalyticsFactory } from 'src/server/analytics/service/analytics.factory';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { PermissionFactory } from './permission.factory';
import { PermissionService } from './permission.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [PermissionService, PermissionFactory, ExceptionsService, LoggerService, AnalyticsService, AnalyticsFactory],
  exports: [PermissionService, PermissionFactory]
})
export class PermissionModule {}
