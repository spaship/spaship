import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { CreatePropertyDto } from './property.dto';
import { PropertyFactory } from './service/property.factory';
import { PropertyService } from './service/property.service';

@Controller('property')
export class PropertyController {
  constructor(private propertyService: PropertyService, private propertyFactoryService: PropertyFactory, private loggerService: LoggerService) {}

  @Get()
  @ApiOperation({ description: 'Get the Property Details.' })
  async getById(@Query('identifier') identifier: string) {
    if (!identifier) return this.propertyService.getAllProperties();
    return this.propertyService.getPropertyDetails(identifier);
  }

  @Post()
  @ApiOperation({ description: 'Create a New Property.' })
  async createProperty(@Body() propertyDto: CreatePropertyDto): Promise<any> {
    return this.propertyService.createProperty(propertyDto);
  }

  @Post('/environment')
  @ApiOperation({ description: 'Create a New Environment.' })
  async createEnvironment(@Body() propertyDto: CreatePropertyDto): Promise<any> {
    return this.propertyService.createEnvironment(propertyDto);
  }
}
