import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';

@Module({
  imports: [TerminusModule],
  providers: [TerminusModule, HealthService],
  exports: [HealthService]
})
export class HealthModule {}
