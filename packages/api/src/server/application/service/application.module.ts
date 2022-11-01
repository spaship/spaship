import { Module } from "@nestjs/common";
import { LoggerService } from "src/configuration/logger/logger.service";
import { DataServicesModule } from "../../../repository/data-services.module";
import { ApplicationFactoryService } from "./application.factory";
import { ApplicationService } from "./application.service";

@Module({
  imports: [DataServicesModule],
  providers: [ApplicationFactoryService, ApplicationService, LoggerService],
  exports: [ApplicationFactoryService, ApplicationService],
})
export class ApplicationUseCasesModule { }
