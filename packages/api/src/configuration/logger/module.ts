import { Module } from '@nestjs/common';
import { LoggerService } from './service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
