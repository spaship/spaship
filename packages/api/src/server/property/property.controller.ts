import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { LoggerService } from "src/core/logger/logger.service";
import { ExceptionsService } from "src/services/exceptions/exceptions.service";
import { PropertyUseCases, PropertyFactoryService } from "../../services/property";
import { CreatePropertyDto } from "./property.dto";

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
    return await this.propertyUseCases.createProperty(propertyDto);
  }
}
