import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { LighthouseService } from '.';
import { DataServicesModule } from '../../../repository/data-services.module';
import { LighthouseFactory } from './factory';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [LighthouseService, LighthouseFactory, ExceptionsService, LoggerService],
  exports: [LighthouseService, LighthouseFactory]
})
export class LighthouseModule {}
