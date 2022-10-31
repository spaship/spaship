import { Module } from "@nestjs/common";
import { DataServicesModule } from "../data-services/data-services.module";
import { PropertyFactoryService } from "./property.factory";
import { PropertyUseCases } from "./property.service";

@Module({
  imports: [DataServicesModule],
  providers: [PropertyFactoryService, PropertyUseCases],
  exports: [PropertyFactoryService, PropertyUseCases],
})
export class PropertyUseCasesModule {}
