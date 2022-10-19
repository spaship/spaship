import { Module } from "@nestjs/common";
import { LoggerModule } from "src/core/logger/logger.module";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { ApplicationFactoryService } from "./application-factory.service";
import { ApplicationUseCases } from "./application.use-case";

@Module({
  imports: [DataServicesModule],
  providers: [ApplicationFactoryService, ApplicationUseCases],
  exports: [ApplicationFactoryService, ApplicationUseCases],
})
export class ApplicationUseCasesModule { }
