import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/entity';
import { AnalyticsService } from 'src/server/analytics/service';
import { CreateApikeyDto, DeleteApikeyDto, ResponseApikeyDto } from 'src/server/api-key/dto';
import { Apikey } from 'src/server/api-key/entity';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Source } from 'src/server/property/entity';
import { v4 as uuidv4 } from 'uuid';
import { ApikeyFactory } from './factory';

@Injectable()
export class ApikeyService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly apikeyFactoryService: ApikeyFactory,
    private readonly analyticsService: AnalyticsService,
    private readonly exceptionsService: ExceptionsService
  ) {}

  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 2000;

  async getApikeyByProperty(propertyIdentifier: string): Promise<ResponseApikeyDto[]> {
    const keys = { propertyIdentifier };
    const apiKeys = await this.dataServices.apikey.getByOptions(keys, { createdAt: -1 }, ApikeyService.defaultSkip, ApikeyService.defaultLimit);
    const apiKeysResponse: ResponseApikeyDto[] = [];
    apiKeys.forEach(async (apiKey) => {
      const tmpApiKey = new ResponseApikeyDto();
      tmpApiKey.propertyIdentifier = apiKey.propertyIdentifier;
      tmpApiKey.label = apiKey.label;
      tmpApiKey.env = apiKey.env;
      tmpApiKey.expirationDate = apiKey.expirationDate;
      tmpApiKey.shortKey = apiKey.shortKey;
      tmpApiKey.createdBy = apiKey.createdBy;
      tmpApiKey.createdAt = apiKey.createdAt;
      apiKeysResponse.push(tmpApiKey);
    });
    return apiKeysResponse;
  }

  createApikey(createApikeyDto: CreateApikeyDto): any {
    const key = uuidv4();
    const apikey = this.apikeyFactoryService.createNewApikey(createApikeyDto, key);
    this.analyticsService.createActivityStream(
      createApikeyDto.propertyIdentifier,
      Action.APIKEY_CREATED,
      createApikeyDto.env.toString(),
      'NA',
      `${apikey.shortKey} Created for ${apikey.propertyIdentifier}`,
      apikey.createdBy,
      Source.MANAGER,
      JSON.stringify(apikey)
    );
    this.dataServices.apikey.create(apikey);
    return { key };
  }

  async deleteApiKey(deleteApikeyDto: DeleteApikeyDto): Promise<Apikey> {
    const apiKey = (
      await this.dataServices.apikey.getByAny({ propertyIdentifier: deleteApikeyDto.propertyIdentifier, shortKey: deleteApikeyDto.shortKey })
    )[0];
    if (!apiKey) {
      this.exceptionsService.badRequestException({ message: `Requested API Key doesn't exist for ${deleteApikeyDto.propertyIdentifier}` });
    }
    await this.analyticsService.createActivityStream(
      apiKey.propertyIdentifier,
      Action.APIKEY_DELETED,
      apiKey.env.toString(),
      'NA',
      `${deleteApikeyDto.shortKey} Deleted for ${apiKey.propertyIdentifier}`,
      deleteApikeyDto.createdBy,
      Source.MANAGER,
      JSON.stringify(apiKey)
    );
    return Promise.resolve(
      this.dataServices.apikey.delete({ propertyIdentifier: deleteApikeyDto.propertyIdentifier, shortKey: deleteApikeyDto.shortKey })
    );
  }

  validateApiKey() {
    return { message: 'Api Key is valid.' };
  }
}
