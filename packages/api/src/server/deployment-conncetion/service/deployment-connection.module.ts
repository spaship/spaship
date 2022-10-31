import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../../repository/data-services.module";
import { DeploymentConnectionFactoryService } from "./deployment-connection.factory";
import { DeploymentConnectionUseCases } from "./deployment-connection.service";

@Module({
  imports: [DataServicesModule],
  providers: [DeploymentConnectionFactoryService, DeploymentConnectionUseCases],
  exports: [DeploymentConnectionFactoryService, DeploymentConnectionUseCases],
})
export class DeploymentConnectionUseCasesModule {}
