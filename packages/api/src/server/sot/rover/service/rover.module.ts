import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../../repository/data-services.module';
import { RoverFactory } from './rover.factory';
import { RoverService } from './rover.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [RoverService, RoverFactory, ExceptionsService, LoggerService, ExceptionsService],
  exports: [RoverService, RoverFactory]
})
export class RoverModule {}
