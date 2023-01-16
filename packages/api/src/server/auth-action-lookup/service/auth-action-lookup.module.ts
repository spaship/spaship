import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { AuthActionLookupFactory } from './auth-action-lookup.factory';
import { AuthActionLookupService } from './auth-action-lookup.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [AuthActionLookupService, AuthActionLookupFactory, ExceptionsService, LoggerService],
  exports: [AuthActionLookupService, AuthActionLookupFactory]
})
export class AuthActionLookupModule {}
