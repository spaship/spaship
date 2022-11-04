import { Module } from '@nestjs/common';
import { DataServicesModule } from '../../../repository/data-services.module';
import { ApikeyFactory } from './apikey.factory';
import { ApikeyService } from './apikey.service';

@Module({
  imports: [DataServicesModule],
  providers: [ApikeyFactory, ApikeyService],
  exports: [ApikeyFactory, ApikeyService]
})
export class ApikeyUseCasesModule {}
