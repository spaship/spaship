import { Module } from "@nestjs/common";
import { DataServicesModule } from "../data-services/data-services.module";
import { ApikeyFactoryService } from "./apikey-factory.service";
import { ApikeyUseCases } from "./apikey.use-case";

@Module({
  imports: [DataServicesModule],
  providers: [ApikeyFactoryService, ApikeyUseCases],
  exports: [ApikeyFactoryService, ApikeyUseCases],
})
export class ApikeyUseCasesModule {}
