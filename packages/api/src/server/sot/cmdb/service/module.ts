import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../../repository/data-services.module';
import { CMDBFactory } from './factory';
import { CMDBService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [CMDBService, CMDBFactory, ExceptionsService, LoggerService, ExceptionsService],
  exports: [CMDBService, CMDBFactory]
})
export class CMDBModule {}
