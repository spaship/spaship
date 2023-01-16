import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { SearchFactory } from './search.factory';
import { SearchService } from './search.service';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [SearchService, SearchFactory, ExceptionsService, LoggerService, ExceptionsService],
  exports: [SearchService, SearchFactory]
})
export class SearchModule {}
