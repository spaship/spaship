import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { AuthActionLookupFactory } from './factory';
import { AuthActionLookupService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [AuthActionLookupService, AuthActionLookupFactory, ExceptionsService, LoggerService],
  exports: [AuthActionLookupService, AuthActionLookupFactory]
})
export class AuthActionLookupModule {}
