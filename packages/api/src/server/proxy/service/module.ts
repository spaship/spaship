import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerService } from 'src/configuration/logger/service';
import { HttpModule } from '@nestjs/axios';
import { ExceptionsService } from 'src/server/exceptions/service';
import { ProxyService } from '.';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [TerminusModule, ProxyService, LoggerService, ExceptionsService],
  exports: [ProxyService]
})
export class ProxyModule {}
