import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { CreateApikeyDto } from 'src/server/api-key/apikey.dto';
import { Apikey } from 'src/server/api-key/apikey.entity';
import { ApikeyFactory } from './apikey.factory';

@Injectable()
export class ApikeyService {
  constructor(private dataServices: IDataServices, private apikeyFactoryService: ApikeyFactory) {}

  getApikeyByProperty(propertyIdentifier: string): Promise<Apikey[]> {
    return this.dataServices.apikey.getByAny({ propertyIdentifier });
  }

  createApikey(createApikeyDto: CreateApikeyDto): Promise<Apikey> {
    const apikey = this.apikeyFactoryService.createNewApikey(createApikeyDto);
    return this.dataServices.apikey.create(apikey);
  }

  deleteApiKey(shortKey: string): Promise<Apikey> {
    return this.dataServices.apikey.delete({ shortKey });
  }
}
