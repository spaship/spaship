import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { DocumentationFactory } from './documentation.factory';
import { DocumentationService } from './documentation.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [DocumentationService, DocumentationFactory, ExceptionsService, LoggerService],
  exports: [DocumentationService, DocumentationFactory]
})
export class DocumentationModule {}
