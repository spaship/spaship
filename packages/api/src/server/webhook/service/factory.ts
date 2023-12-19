import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { CreateWebhookDto } from '../request.dto';
import { Webhook } from '../entity';

@Injectable()
export class WebhookFactory {
  constructor(private readonly logger: LoggerService) {}

  createNewWebhook(createWebhookDto: CreateWebhookDto): Webhook {
    const webhook = new Webhook();
    webhook.propertyIdentifier = createWebhookDto.propertyIdentifier;
    webhook.identifier = this.getWebhookIdentifier(createWebhookDto.name);
    webhook.name = createWebhookDto.name;
    webhook.url = createWebhookDto.url;
    webhook.createdBy = createWebhookDto.createdBy;
    webhook.updatedBy = createWebhookDto.createdBy;
    webhook.actions = createWebhookDto.actions;
    this.logger.log('Webhook', JSON.stringify(webhook));
    return webhook;
  }

  // @internal generate the webhook identifier
  getWebhookIdentifier(identifier): string {
    return (
      encodeURIComponent(identifier)
        .toLowerCase()
        /* Replace the encoded hexadecimal code with `-` */
        .replace(/%[0-9a-zA-Z]{2}/g, '-')
        /* Replace any special characters with `-` */
        .replace(/[\ \-\/\:\@\[\]\`\{\~\.]+/g, '-')
        /* Special characters are replaced by an underscore */
        .replace(/[\|!@#$%^&*;"<>\(\)\+,]/g, '_')
        /* Remove any starting or ending `-` */
        .replace(/^-+|-+$/g, '')
        /* Removing multiple consecutive `-`s */
        .replace(/--+/g, '-')
    );
  }
}
