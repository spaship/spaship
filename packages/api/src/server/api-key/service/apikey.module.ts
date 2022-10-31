import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../../repository/data-services.module";
import { ApikeyFactoryService } from "./apikey.factory";
import { ApikeyUseCases } from "./apikey.service";

@Module({
  imports: [DataServicesModule],
  providers: [ApikeyFactoryService, ApikeyUseCases],
  exports: [ApikeyFactoryService, ApikeyUseCases],
})
export class ApikeyUseCasesModule {}
