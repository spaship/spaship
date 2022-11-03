import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { CreateApikeyDto } from 'src/server/api-key/apikey.dto';
import { Apikey } from 'src/server/api-key/apikey.entity';
import { ApikeyFactoryService } from './apikey.factory';

@Injectable()
export class ApikeyUseCases {
  constructor(private dataServices: IDataServices, private apikeyFactoryService: ApikeyFactoryService) {}

  getApikeyById(propertyName: string): Promise<Apikey[]> {
    return this.dataServices.apikeys.getByAny({ propertyName });
  }

  createApikey(createApikeyDto: CreateApikeyDto): Promise<Apikey> {
    const apikey = this.apikeyFactoryService.createNewApikey(createApikeyDto);
    return this.dataServices.apikeys.create(apikey);
  }
}
