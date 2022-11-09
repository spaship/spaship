import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/auth.guard';
import { CreateApikeyDto } from './apikey.dto';
import { ApikeyService } from './service/apikey.service';

@Controller('apikey')
@ApiTags('Api Key')
@UseGuards(AuthenticationGuard)
export class ApikeyController {
  constructor(private readonly apiKeyService: ApikeyService) {}

  @Get(':propertyIdentifier')
  async getApiKeyByProperty(@Param('propertyIdentifier') propertyIdentifier: string) {
    return await this.apiKeyService.getApikeyByProperty(propertyIdentifier);
  }

  @Post()
  async createApiKey(@Body() apikeyDto: CreateApikeyDto) {
    return this.apiKeyService.createApikey(apikeyDto);
  }

  @Delete(':shortKey')
  async deleteApiKey(@Param('shortKey') shortKey: string) {
    return this.apiKeyService.deleteApiKey(shortKey);
  }
}
