import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AnalyticsFactory } from 'src/server/analytics/service/factory';
import { AnalyticsService } from 'src/server/analytics/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { PermissionFactory } from './factory';
import { PermissionService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [PermissionService, PermissionFactory, ExceptionsService, LoggerService, AnalyticsService, AnalyticsFactory],
  exports: [PermissionService, PermissionFactory]
})
export class PermissionModule {}
