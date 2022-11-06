import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateApikeyDto } from './apikey.dto';
import { ApikeyService } from './service/apikey.service';

@Controller('apikey')
@ApiTags('Api Key')
export class ApikeyController {
  constructor(private apiKeyService: ApikeyService) {}

  @Get(':propertyIdentifier')
  async getApiKeyByProperty(@Param('propertyIdentifier') propertyIdentifier: string) {
    return this.apiKeyService.getApikeyByProperty(propertyIdentifier);
  }

  @Post()
  async createApiKey(@Body() apikeyDto: CreateApikeyDto) {
    return this.apiKeyService.createApikey(apikeyDto);
  }

  @Delete(':shortKey')
  async deleteApiKey(@Param('shortKey') shortKey: string) {
    return await this.apiKeyService.deleteApiKey(shortKey);
  }
}
