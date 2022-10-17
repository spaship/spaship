import { Injectable } from "@nestjs/common";
import { Apikey } from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import { CreateApikeyDto, UpdateApikeyDto } from "../../core/dtos";
import { ApikeyFactoryService } from "./apikey-factory.service";

@Injectable()
export class ApikeyUseCases {
  constructor(private dataServices: IDataServices, private apikeyFactoryService: ApikeyFactoryService) {}

  getAllApikeys(): Promise<Apikey[]> {
    return this.dataServices.apikeys.getAll();
  }

  getApikeyById(id: any): Promise<Apikey> {
    return this.dataServices.apikeys.get(id);
  }

  createApikey(createApikeyDto: CreateApikeyDto): Promise<Apikey> {
    const apikey = this.apikeyFactoryService.createNewApikey(createApikeyDto);
    return this.dataServices.apikeys.create(apikey);
  }

  updateApikey(apikeyId: string, updateApikeyDto: UpdateApikeyDto): Promise<Apikey> {
    const apikey = this.apikeyFactoryService.updateApikey(updateApikeyDto);
    return this.dataServices.apikeys.update(apikeyId, apikey);
  }
}
