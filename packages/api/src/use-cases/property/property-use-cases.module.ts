import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { PropertyFactoryService } from "./property-factory.service";
import { PropertyUseCases } from "./property.use-case";

@Module({
  imports: [DataServicesModule],
  providers: [PropertyFactoryService, PropertyUseCases],
  exports: [PropertyFactoryService, PropertyUseCases],
})
export class PropertyUseCasesModule {}
