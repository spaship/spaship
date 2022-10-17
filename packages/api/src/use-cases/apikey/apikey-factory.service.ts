import { Injectable } from "@nestjs/common";
import { Apikey } from "../../core/entities";
import { CreateApikeyDto, UpdateApikeyDto } from "../../core/dtos";

@Injectable()
export class ApikeyFactoryService {
  createNewApikey(createApikeyDto: CreateApikeyDto) {
    const newApikey = new Apikey();
    newApikey.label = createApikeyDto.label;
    newApikey.propertyName = createApikeyDto.propertyName;
    newApikey.shortKey = Math.random().toString();
    newApikey.hashKey = Math.random().toString();
    newApikey.key = Math.random().toString();
    newApikey.token = Math.random().toString();
    newApikey.env = createApikeyDto.env;
    newApikey.expiredDate = createApikeyDto.expiredDate;
    newApikey.createdBy = createApikeyDto.createdBy;

    return newApikey;
  }

  updateApikey(updateApikeyDto: UpdateApikeyDto) {
    const newApikey = new Apikey();

    return newApikey;
  }
}
