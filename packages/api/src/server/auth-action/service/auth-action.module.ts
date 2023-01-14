import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { AuthActionFactory } from './auth-action.factory';
import { AuthActionService } from './auth-action.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [AuthActionService, AuthActionFactory, ExceptionsService, LoggerService],
  exports: [AuthActionService, AuthActionFactory]
})
export class AuthActionModule {}
