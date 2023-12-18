import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../../repository/data-services.module';
import { RoverFactory } from './factory';
import { RoverService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [RoverService, RoverFactory, ExceptionsService, LoggerService, ExceptionsService],
  exports: [RoverService, RoverFactory]
})
export class RoverModule {}
