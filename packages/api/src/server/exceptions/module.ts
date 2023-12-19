import { Module } from '@nestjs/common';
import { ExceptionsService } from './service';

@Module({
  providers: [ExceptionsService],
  exports: [ExceptionsService]
})
export class ExceptionsModule {}
