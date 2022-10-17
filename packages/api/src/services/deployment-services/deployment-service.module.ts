import { Module } from "@nestjs/common";
import { DeploymentServicesModule } from "../../frameworks/deployment-services/deployment-service.module";

@Module({
  imports: [DeploymentServicesModule],
  exports: [DeploymentServicesModule],
})
export class DeployServicesModule {}
