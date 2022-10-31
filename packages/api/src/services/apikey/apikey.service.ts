import { Injectable } from "@nestjs/common";
import { IDataServices } from "../../core/abstracts";
import { CreateApikeyDto } from "../../core/dtos";
import { Apikey } from "../../core/entities";
import { ApikeyFactoryService } from "./apikey.factory";

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
