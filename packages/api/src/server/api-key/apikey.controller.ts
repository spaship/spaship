import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateApikeyDto } from './apikey.dto';
import { ApikeyUseCases } from './service/apikey.service';

@Controller('apikey')
export class ApikeyController {
  constructor(private apikeyUseCases: ApikeyUseCases) {}

  @Get(':propertyName')
  async getById(@Param('propertyName') propertyName: any) {
    return this.apikeyUseCases.getApikeyById(propertyName);
  }

  @Post()
  createApikey(@Body() apikeyDto: CreateApikeyDto) {
    return this.apikeyUseCases.createApikey(apikeyDto);
  }
}
