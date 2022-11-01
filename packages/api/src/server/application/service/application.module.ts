import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { Axios } from "axios";
import { LoggerService } from "src/configuration/logger/logger.service";
import { DataServicesModule } from "../../../repository/data-services.module";
import { ApplicationFactoryService } from "./application.factory";
import { ApplicationService } from "./application.service";
@Module({
  imports: [DataServicesModule, HttpModule, Axios],
  providers: [ApplicationFactoryService, ApplicationService, LoggerService, Axios],
  exports: [ApplicationFactoryService, ApplicationService],
})
export class ApplicationUseCasesModule { }
