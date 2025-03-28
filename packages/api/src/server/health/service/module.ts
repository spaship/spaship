import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerService } from 'src/configuration/logger/service';
import { HttpModule } from '@nestjs/axios';
import { ExceptionsService } from 'src/server/exceptions/service';
import { HealthService } from '.';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [TerminusModule, HealthService, LoggerService, ExceptionsService],
  exports: [HealthService]
})
export class HealthModule {}
