import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { LoggerService } from "src/configuration/logger/logger.service";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { CreatePropertyDto } from "./property.dto";
import { PropertyFactoryService } from "./service/property.factory";
import { PropertyUseCases } from "./service/property.service";

@Controller("property")
export class PropertyController {
  constructor(
    private propertyUseCases: PropertyUseCases,
    private propertyFactoryService: PropertyFactoryService,
    private loggerService: LoggerService
  ) {}

  @Get()
  @ApiOperation({ description: "Get the list of all the SPAs" })
  async getAll() {
    return this.propertyUseCases.getAllPropertys();
  }

  @Get(":id")
  async getById(@Param("id") id: any) {
    return this.propertyUseCases.getPropertyById(id);
  }

  @Post()
  async createProperty(@Body() propertyDto: CreatePropertyDto): Promise<any> {
    return this.propertyUseCases.createProperty(propertyDto);
  }
}
