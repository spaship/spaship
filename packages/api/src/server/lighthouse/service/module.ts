import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { LighthouseFactory } from './factory';
import { LighthouseService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [LighthouseService, LighthouseFactory, ExceptionsService, LoggerService],
  exports: [LighthouseService, LighthouseFactory]
})
export class LighthouseModule {}
