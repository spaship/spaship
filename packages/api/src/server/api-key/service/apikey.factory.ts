import { Injectable } from '@nestjs/common';
import { CreateApikeyDto } from 'src/server/api-key/apikey.dto';
import { Apikey } from 'src/server/api-key/apikey.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApikeyFactory {
  createNewApikey(createApikeyDto: CreateApikeyDto): Apikey {
    const apiKey = new Apikey();
    apiKey.propertyIdentifier = createApikeyDto.propertyIdentifier;
    apiKey.createdBy = createApikeyDto.createdBy;
    apiKey.label = createApikeyDto.label;
    apiKey.env = createApikeyDto.env;
    apiKey.expiredDate = this.formatApikeyDate(createApikeyDto.expiresIn);
    apiKey.key = uuidv4();
    apiKey.shortKey = apiKey.key.substring(0, 7);
    return apiKey;
  }

  formatApikeyDate(expiration) {
    const currentDate = new Date();
    const utcDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
    utcDate.setDate(utcDate.getDate() + parseInt(expiration));
    return utcDate;
  }
}
