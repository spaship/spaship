import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateApikeyDto } from "../core/dtos";
import { ApikeyUseCases } from "../use-cases/apikey/apikey.use-case";

@Controller("apikey")
export class ApikeyController {
  constructor(private apikeyUseCases: ApikeyUseCases) {}

  @Get(":propertyName")
  //@UseGuards(JwtAuthGuard)
  async getById(@Param("propertyName") propertyName: any) {
    return this.apikeyUseCases.getApikeyById(propertyName);
  }

  @Post()
  createApikey(@Body() apikeyDto: CreateApikeyDto) {
    return this.apikeyUseCases.createApikey(apikeyDto);
  }
}
