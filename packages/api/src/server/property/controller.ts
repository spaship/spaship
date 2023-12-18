import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guard';
import { CreatePropertyDto } from './request.dto';
import { PropertyResponseDto } from './response.dto';
import { PropertyService } from './service';

@Controller('property')
@ApiTags('Property')
@UseGuards(AuthenticationGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiOperation({ description: 'Get the Property Details.' })
  async getById(@Query('identifier') identifier: string) {
    if (!identifier) return this.propertyService.getAllProperties();
    return this.propertyService.getPropertyDetails(identifier);
  }

  @Post()
  @ApiOperation({ description: 'Create a New Property.' })
  async createProperty(@Body() propertyDto: CreatePropertyDto): Promise<PropertyResponseDto> {
    return this.propertyService.createProperty(propertyDto);
  }

  @Put()
  @ApiOperation({ description: 'Update a Property.' })
  async updateProperty(@Body() propertyDto: CreatePropertyDto): Promise<PropertyResponseDto> {
    return this.propertyService.updateProperty(propertyDto);
  }
}
