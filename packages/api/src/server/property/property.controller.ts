import { Controller, Get, Param, Post, Body, Put, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { LoggerService } from "src/configuration/logger/logger.service";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { CreatePropertyDto } from "./property.dto";
import { PropertyFactory } from "./service/property.factory";
import { PropertyService } from "./service/property.service";

@Controller("property")
export class PropertyController {
  constructor(
    private propertyUseCases: PropertyService,
    private propertyFactoryService: PropertyFactory,
    private loggerService: LoggerService
  ) { }


  @Get()
  @ApiOperation({ description: "Get the Property Details." })
  async getById(@Query("identifier") identifier: string) {
    if (!identifier) return this.propertyUseCases.getAllProperties();
    return this.propertyUseCases.getPropertyDetails(identifier);
  }

  @Post()
  @ApiOperation({ description: "Create a New Property." })
  async createProperty(@Body() propertyDto: CreatePropertyDto): Promise<any> {
    return this.propertyUseCases.createProperty(propertyDto);
  }

  @Post('/environment')
  @ApiOperation({ description: "Create a New Environment." })
  async createEnvironment(@Body() propertyDto: CreatePropertyDto): Promise<any> {
    return this.propertyUseCases.createEnvironment(propertyDto);
  }
}
