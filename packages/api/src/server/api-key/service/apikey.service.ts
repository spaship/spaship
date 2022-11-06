import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { CreateApikeyDto } from 'src/server/api-key/apikey.dto';
import { Apikey } from 'src/server/api-key/apikey.entity';
import { Source } from 'src/server/property/property.entity';
import { ApikeyFactory } from './apikey.factory';

@Injectable()
export class ApikeyService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly apikeyFactoryService: ApikeyFactory,
    private readonly analyticsService: AnalyticsService
  ) {}

  getApikeyByProperty(propertyIdentifier: string): Promise<Apikey[]> {
    return this.dataServices.apikey.getByAny({ propertyIdentifier });
  }

  createApikey(createApikeyDto: CreateApikeyDto): Promise<Apikey> {
    const apikey = this.apikeyFactoryService.createNewApikey(createApikeyDto);
    this.analyticsService.createActivityStream(createApikeyDto.propertyIdentifier, Action.APIKEY_CREATED, createApikeyDto.env.toString());
    return this.dataServices.apikey.create(apikey);
  }

  async deleteApiKey(shortKey: string): Promise<Apikey> {
    const apiKey = (await this.dataServices.apikey.getByAny({ shortKey }))[0];
    this.analyticsService.createActivityStream(
      apiKey.propertyIdentifier,
      Action.APIKEY_DELETED,
      apiKey.env.toString(),
      'NA',
      `${shortKey} Deleted for ${apiKey.propertyIdentifier}`,
      apiKey.createdBy,
      Source.MANAGER,
      JSON.stringify(apiKey)
    );
    return await this.dataServices.apikey.delete({ shortKey });
  }
}
