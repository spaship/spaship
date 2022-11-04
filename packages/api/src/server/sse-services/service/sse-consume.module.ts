import { Module } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { DataServicesModule } from 'src/repository/data-services.module';
import { SSEConsumeService } from './sse-consume.service';

@Module({
  imports: [DataServicesModule],
  providers: [SSEConsumeModule, SSEConsumeService, LoggerService],
  exports: [SSEConsumeModule, SSEConsumeService]
})
export class SSEConsumeModule {}
