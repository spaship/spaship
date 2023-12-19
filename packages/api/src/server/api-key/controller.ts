import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guard';
import { CreateApikeyDto, DeleteApikeyDto } from './dto';
import { Apikey } from './entity';
import { ApikeyService } from './service';

@Controller('apikey')
@ApiTags('Api Key')
@UseGuards(AuthenticationGuard)
export class ApikeyController {
  constructor(private readonly apiKeyService: ApikeyService) {}

  @Get(':propertyIdentifier')
  @ApiOperation({ description: 'Get the API Keys for property.' })
  async getApiKeyByProperty(@Param('propertyIdentifier') propertyIdentifier: string) {
    return this.apiKeyService.getApikeyByProperty(propertyIdentifier);
  }

  @Post()
  @ApiOperation({ description: 'Create a new API Key.' })
  async createApiKey(@Body() apikeyDto: CreateApikeyDto) {
    return this.apiKeyService.createApikey(apikeyDto);
  }

  @Delete()
  @ApiOperation({ description: 'Delete an API Key.' })
  async deleteApiKey(@Body() deleteApikeyDto: DeleteApikeyDto): Promise<Apikey> {
    return this.apiKeyService.deleteApiKey(deleteApikeyDto);
  }
}
