import { Module } from "@nestjs/common";
import { LoggerModule } from "src/core/logger/logger.module";
import { DataServicesModule } from "../data-services/data-services.module";
import { ApplicationFactoryService } from "./application.factory";
import { ApplicationUseCases } from "./application.service";

@Module({
  imports: [DataServicesModule],
  providers: [ApplicationFactoryService, ApplicationUseCases],
  exports: [ApplicationFactoryService, ApplicationUseCases],
})
export class ApplicationUseCasesModule { }
