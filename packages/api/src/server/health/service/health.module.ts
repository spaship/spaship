import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '../health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TerminusModule],
  providers: [TerminusModule, HealthController, HealthService],
  exports: [HealthService]
})
export class HealthModule {}
