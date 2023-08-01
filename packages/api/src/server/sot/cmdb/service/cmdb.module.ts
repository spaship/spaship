import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../../repository/data-services.module';
import { CMDBFactory } from './cmdb.factory';
import { CMDBService } from './cmdb.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [CMDBService, CMDBFactory, ExceptionsService, LoggerService, ExceptionsService],
  exports: [CMDBService, CMDBFactory]
})
export class CMDBModule {}
