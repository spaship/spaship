import { Module } from '@nestjs/common';
import { SSEConsumeService } from './sse-consume.service';

@Module({
  providers: [SSEConsumeService],
  exports: [SSEConsumeService]
})
export class SSEConsumeModule {}
