import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { CreateApikeyDto } from './apikey.dto';
import { ApikeyService } from './service/apikey.service';

@Controller('apikey')
export class ApikeyController {
  constructor(private apiKeyService: ApikeyService) {}

  @Get(':propertyIdentifier')
  async getApiKeyByProperty(@Param('propertyIdentifier') propertyIdentifier: string) {
    return this.apiKeyService.getApikeyByProperty(propertyIdentifier);
  }

  @Post()
  createApiKey(@Body() apikeyDto: CreateApikeyDto) {
    return this.apiKeyService.createApikey(apikeyDto);
  }

  @Delete(':shortKey')
  deleteApiKey(@Param('shortKey') shortKey: string) {
    return this.apiKeyService.deleteApiKey(shortKey);
  }
}
