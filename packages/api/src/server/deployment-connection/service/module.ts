import { Module } from '@nestjs/common';
import { DataServicesModule } from '../../../repository/data-services.module';
import { DeploymentConnectionFactoryService } from './factory';
import { DeploymentConnectionService } from '.';

@Module({
  imports: [DataServicesModule],
  providers: [DeploymentConnectionFactoryService, DeploymentConnectionService],
  exports: [DeploymentConnectionFactoryService, DeploymentConnectionService]
})
export class DeploymentConnectionModule {}
