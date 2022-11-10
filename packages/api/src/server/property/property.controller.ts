import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/auth.guard';
import { CreatePropertyDto } from './property.dto';
import { PropertyService } from './service/property.service';

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
  async createProperty(@Body() propertyDto: CreatePropertyDto): Promise<any> {
    return this.propertyService.createProperty(propertyDto);
  }
}
