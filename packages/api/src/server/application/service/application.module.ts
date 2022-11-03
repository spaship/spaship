import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { ApplicationFactory } from './application.factory';
import { ApplicationService } from './application.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [ApplicationFactory, ApplicationService, LoggerService, ExceptionsService],
  exports: [ApplicationFactory, ApplicationService]
})
export class ApplicationUseCasesModule {}
