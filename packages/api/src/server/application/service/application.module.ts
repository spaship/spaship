import { Module } from "@nestjs/common";
import { LoggerModule } from "src/configuration/logger/logger.module";
import { DataServicesModule } from "../../../services/data-services/data-services.module";
import { ApplicationFactoryService } from "./application.factory";
import { ApplicationUseCases } from "./application.service";

@Module({
  imports: [DataServicesModule],
  providers: [ApplicationFactoryService, ApplicationUseCases],
  exports: [ApplicationFactoryService, ApplicationUseCases],
})
export class ApplicationUseCasesModule { }
