import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { DeployServicesModule } from "../../services/deployment-services/deployment-service.module";
import { ApplicationFactoryService } from "./application-factory.service";
import { ApplicationUseCases } from "./application.use-case";

@Module({
  imports: [DataServicesModule, DeployServicesModule],
  providers: [ApplicationFactoryService, ApplicationUseCases],
  exports: [ApplicationFactoryService, ApplicationUseCases],
})
export class ApplicationUseCasesModule {}
