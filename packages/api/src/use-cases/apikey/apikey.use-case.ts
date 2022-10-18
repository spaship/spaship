import { Injectable } from "@nestjs/common";
import { Apikey } from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import { CreateApikeyDto, UpdateApikeyDto } from "../../core/dtos";
import { ApikeyFactoryService } from "./apikey-factory.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ApikeyUseCases {
  constructor(private dataServices: IDataServices, private apikeyFactoryService: ApikeyFactoryService) {}

  getAllApikeys(): Promise<Apikey[]> {
    return this.dataServices.apikeys.getAll();
  }

  getApikeyById(propertyName: string): Promise<Apikey[]> {
    return this.dataServices.apikeys.getByAny({ propertyName: propertyName });
  }

  createApikey(createApikeyDto: CreateApikeyDto): Promise<Apikey> {
    const apikey = this.apikeyFactoryService.createNewApikey(createApikeyDto);
    return this.dataServices.apikeys.create(apikey);
  }
}
