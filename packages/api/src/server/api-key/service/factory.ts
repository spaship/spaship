import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateApikeyDto } from 'src/server/api-key/dto';
import { Apikey } from 'src/server/api-key/entity';

@Injectable()
export class ApikeyFactory {
  createNewApikey(createApikeyDto: CreateApikeyDto, key: string): Apikey {
    const apiKey = new Apikey();
    apiKey.propertyIdentifier = createApikeyDto.propertyIdentifier;
    apiKey.createdBy = createApikeyDto.createdBy;
    apiKey.label = createApikeyDto.label;
    apiKey.env = createApikeyDto.env;
    apiKey.hashKey = this.getHashKey(key);
    apiKey.shortKey = key.substring(0, 7);
    apiKey.expirationDate = this.formatApikeyDate(createApikeyDto.expiresIn);
    return apiKey;
  }

  formatApikeyDate(expiration) {
    const currentDate = new Date();
    const utcDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
    utcDate.setDate(utcDate.getDate() + parseInt(expiration, 10));
    return utcDate;
  }

  getHashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }
}
