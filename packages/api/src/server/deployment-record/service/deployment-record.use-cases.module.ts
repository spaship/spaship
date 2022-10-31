import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../../repository/data-services.module";
import { DeploymentRecordFactoryService } from "./deployment-record.service";
import { DeploymentRecordUseCases } from "./deployment-record.use-case";

@Module({
  imports: [DataServicesModule],
  providers: [DeploymentRecordFactoryService, DeploymentRecordUseCases],
  exports: [DeploymentRecordFactoryService, DeploymentRecordUseCases],
})
export class DeploymentRecordUseCasesModule {}
