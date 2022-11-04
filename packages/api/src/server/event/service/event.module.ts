import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { DataServicesModule } from 'src/repository/data-services.module';
import { EventService } from './event.service';

@Module({
  imports: [DataServicesModule],
  providers: [EventModule, EventService, LoggerService],
  exports: [EventModule, EventService]
})
export class EventModule {}
