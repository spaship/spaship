import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApikeyUseCases } from "../../services/apikey/apikey.service";
import { CreateApikeyDto } from "./apikey.dto";

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
