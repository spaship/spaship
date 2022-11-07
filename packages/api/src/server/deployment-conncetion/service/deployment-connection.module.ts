import { Module } from '@nestjs/common';
import { DataServicesModule } from '../../../repository/data-services.module';
import { DeploymentConnectionFactoryService } from './deployment-connection.factory';
import { DeploymentConnectionService } from './deployment-connection.service';

@Module({
  imports: [DataServicesModule],
  providers: [DeploymentConnectionFactoryService, DeploymentConnectionService],
  exports: [DeploymentConnectionFactoryService, DeploymentConnectionService]
})
export class DeploymentConnectionModule {}
