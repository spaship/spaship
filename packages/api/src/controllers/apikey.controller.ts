import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateApikeyDto } from "../core/dtos";
import { ApikeyUseCases } from "../services/apikey/apikey.service";

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
