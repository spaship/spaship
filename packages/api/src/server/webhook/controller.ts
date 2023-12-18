import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { CreateWebhookDto, UpdateWebhookDto } from './request.dto';
import { Webhook } from './entity';
import { WebhookService } from './service';

@Controller('webhook')
@ApiTags('Webhook')
@UseGuards(AuthenticationGuard)
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  @ApiOperation({ description: 'Get the Webhook Details.' })
  async getById(@Query('propertyIdentifier') propertyIdentifier: string) {
    if (!propertyIdentifier) return this.webhookService.getAllWebHooks();
    return this.webhookService.getWebhooksByProperty(propertyIdentifier);
  }

  @Post()
  @ApiOperation({ description: 'Create a New Webhook.' })
  async createProperty(@Body() webhookDto: CreateWebhookDto): Promise<Webhook> {
    return this.webhookService.createWebhook(webhookDto);
  }

  @Put()
  @ApiOperation({ description: 'Update the Webhook.' })
  async update(@Body() webhookDto: UpdateWebhookDto): Promise<Webhook> {
    return this.webhookService.updateWebhook(webhookDto);
  }

  @Delete('/:propertyIdentifier/:identifier')
  @ApiOperation({ description: 'Delete a Webhook.' })
  async deleteApiKey(@Param('propertyIdentifier') propertyIdentifier: string, @Param('identifier') identifier: string): Promise<Webhook> {
    return this.webhookService.deleteWebhook(propertyIdentifier, identifier);
  }
}
