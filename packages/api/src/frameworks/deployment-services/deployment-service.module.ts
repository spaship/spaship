import { Module } from "@nestjs/common";
import { IDeploymentServices } from "../../core";

import { DeploymentService } from "./deployment-service.service";

@Module({
  providers: [
    {
      provide: IDeploymentServices,
      useClass: DeploymentService,
    },
  ],
  exports: [IDeploymentServices],
})
export class DeploymentServicesModule {}
