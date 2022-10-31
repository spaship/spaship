import { Injectable } from "@nestjs/common";
import { Apikey } from "../../core/entities";
import { v4 as uuidv4 } from "uuid";
import { CreateApikeyDto } from "src/server/api-key/apikey.dto";

@Injectable()
export class ApikeyFactoryService {
  createNewApikey(createApikeyDto: CreateApikeyDto): Apikey {
    const apiKey = new Apikey();
    apiKey.propertyName = createApikeyDto.propertyName;
    apiKey.createdBy = createApikeyDto.createdBy;
    apiKey.label = createApikeyDto.label;
    apiKey.env = createApikeyDto.env;
    apiKey.expiredDate = this.formatApikeyDate(createApikeyDto.expiresIn);
    apiKey.key = uuidv4();
    apiKey.shortKey = apiKey.key.substring(0, 7);
    return apiKey;
  }

  formatApikeyDate(expiration) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + parseInt(expiration));
    return expiresIn;
  }
}
