import { Controller, Get, Param, Post, Body, Put } from "@nestjs/common";
import { CreateApikeyDto, UpdateApikeyDto } from "../core/dtos";
import { ApikeyUseCases } from "../use-cases/apikey/apikey.use-case";

@Controller("apikey")
export class ApikeyController {
  constructor(private apikeyUseCases: ApikeyUseCases) {}

  @Get()
  async getAll() {
    return this.apikeyUseCases.getAllApikeys();
  }

  @Get(":id")
  async getById(@Param("id") id: any) {
    return this.apikeyUseCases.getApikeyById(id);
  }

  @Post()
  createApikey(@Body() apikeyDto: CreateApikeyDto) {
    return this.apikeyUseCases.createApikey(apikeyDto);
  }

  @Put(":id")
  updateApikey(@Param("id") apikeyId: string, @Body() updateApikeyDto: UpdateApikeyDto) {
    return this.apikeyUseCases.updateApikey(apikeyId, updateApikeyDto);
  }
}
