import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/entity';
import { AnalyticsService } from 'src/server/analytics/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Source } from 'src/server/property/entity';
import { CreateWebhookDto, UpdateWebhookDto } from '../request.dto';
import { WebhookFactory } from './factory';

@Injectable()
export class WebhookService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly analyticsService: AnalyticsService,
    private readonly exceptionService: ExceptionsService,
    private readonly webhookFactory: WebhookFactory
  ) {}

  getAllWebHooks(): Promise<any> {
    return this.dataServices.webhook.getAll();
  }

  /* @internal
   * Get the property details based on the propertyIdentifier
   * It'll append the environment details linked with the particular property
   */
  async getWebhooksByProperty(propertyIdentifier: string): Promise<any> {
    const response = await this.dataServices.webhook.getByAny({ propertyIdentifier });
    return response;
  }

  /* @internal
   * This will create the webhook
   * Every webhook is related to a perticular property
   * Save the details related to the webhook
   */
  async createWebhook(createWebhookDto: CreateWebhookDto): Promise<any> {
    const identifier = this.webhookFactory.getWebhookIdentifier(createWebhookDto.name);
    const checkWebhook = await this.dataServices.webhook.getByAny({
      propertyIdentifier: createWebhookDto.propertyIdentifier,
      identifier
    });
    if (checkWebhook.length > 0) this.exceptionService.badRequestException({ message: 'Webhook already exist.' });
    const webhookRequest = this.webhookFactory.createNewWebhook(createWebhookDto);
    await this.analyticsService.createActivityStream(
      createWebhookDto.propertyIdentifier,
      Action.WEBHOOK_CREATED,
      'NA',
      'NA',
      `Webhook created for ${createWebhookDto.actions.toString()}`,
      createWebhookDto.createdBy,
      Source.MANAGER,
      JSON.stringify(webhookRequest)
    );
    return this.dataServices.webhook.create(webhookRequest);
  }

  /* @internal
   * Update the existing webhook
   * Provision for updating the actions & url
   */
  async updateWebhook(updateWebhookDto: UpdateWebhookDto): Promise<any> {
    const updateWebhook = (
      await this.dataServices.webhook.getByAny({ propertyIdentifier: updateWebhookDto.propertyIdentifier, identifier: updateWebhookDto.identifier })
    )[0];
    if (!updateWebhook) this.exceptionService.badRequestException({ message: `Webhook doesn't exist.` });
    updateWebhook.url = updateWebhookDto.url;
    updateWebhook.updatedBy = updateWebhookDto.updatedBy;
    updateWebhook.actions = updateWebhookDto.actions;
    await this.dataServices.webhook.updateOne(
      { propertyIdentifier: updateWebhookDto.propertyIdentifier, identifier: updateWebhookDto.identifier },
      updateWebhook
    );
    await this.analyticsService.createActivityStream(
      updateWebhookDto.propertyIdentifier,
      Action.WEBHOOK_UPDATED,
      'NA',
      'NA',
      `Webhook updated for ${updateWebhookDto.identifier}`,
      updateWebhookDto.updatedBy,
      Source.MANAGER,
      JSON.stringify(updateWebhook)
    );
    return updateWebhook;
  }

  // @internal Delete the webhook from the records
  async deleteWebhook(propertyIdentifier: string, identifier: string): Promise<any> {
    const webhook = await this.dataServices.webhook.getByAny({ propertyIdentifier, identifier });
    if (webhook.length === 0) this.exceptionService.badRequestException({ message: 'No Webhook exists.' });
    const response = await this.dataServices.webhook.delete({ propertyIdentifier, identifier });
    await this.analyticsService.createActivityStream(
      propertyIdentifier,
      Action.WEBHOOK_DELETED,
      'NA',
      'NA',
      `${identifier} webhook deleted for ${propertyIdentifier}`,
      'NA',
      Source.MANAGER,
      JSON.stringify(response)
    );
    return response;
  }
}
