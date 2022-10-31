import { Injectable } from "@nestjs/common";
import { Apikey } from "src/server/api-key/apikey.entity";
import { CreateApikeyDto } from "src/server/api-key/apikey.dto";
import { ApikeyFactoryService } from "./apikey.factory";
import { IDataServices } from "src/repository/data-services.abstract";

@Injectable()
export class ApikeyUseCases {
  constructor(private dataServices: IDataServices, private apikeyFactoryService: ApikeyFactoryService) {}

  getApikeyById(propertyName: string): Promise<Apikey[]> {
    return this.dataServices.apikeys.getByAny({ propertyName: propertyName });
  }

  createApikey(createApikeyDto: CreateApikeyDto): Promise<Apikey> {
    const apikey = this.apikeyFactoryService.createNewApikey(createApikeyDto);
    return this.dataServices.apikeys.create(apikey);
  }
}
