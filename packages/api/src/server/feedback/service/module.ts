import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DataServicesModule } from '../../../repository/data-services.module';
import { FeedbackFactory } from './factory';
import { FeedbackService } from '.';

@Module({
  imports: [DataServicesModule, HttpModule],
  providers: [FeedbackService, FeedbackFactory, ExceptionsService, LoggerService],
  exports: [FeedbackService, FeedbackFactory]
})
export class FeedbackModule {}
