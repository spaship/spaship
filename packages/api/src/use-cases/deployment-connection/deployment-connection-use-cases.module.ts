import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { DeploymentConnectionFactoryService } from "./deployment-connection.service";
import { DeploymentConnectionUseCases } from "./deployment-connection.use-case";

@Module({
  imports: [DataServicesModule],
  providers: [DeploymentConnectionFactoryService, DeploymentConnectionUseCases],
  exports: [DeploymentConnectionFactoryService, DeploymentConnectionUseCases],
})
export class DeploymentConnectionUseCasesModule {}
