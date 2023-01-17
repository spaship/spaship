import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { RoleFactory } from './role.factory';
import { RoleService } from './role.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [RoleService, RoleFactory, ExceptionsService, LoggerService],
  exports: [RoleService, RoleFactory]
})
export class RoleModule {}
