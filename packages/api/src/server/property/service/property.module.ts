import { Module } from "@nestjs/common";
import { LoggerService } from "src/configuration/logger/logger.service";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { DataServicesModule } from "../../../repository/data-services.module";
import { PropertyFactoryService } from "./property.factory";
import { PropertyUseCases } from "./property.service";

@Module({
  imports: [DataServicesModule],
  providers: [PropertyFactoryService, PropertyUseCases, ExceptionsService, LoggerService],
  exports: [PropertyFactoryService, PropertyUseCases],
})
export class PropertyUseCasesModule { }
