import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WebhookDocument = Webhook & Document;

@Schema({ timestamps: true })
export class Webhook {
  @Prop({ required: true })
  propertyIdentifier: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  actions: string[];

  @Prop({})
  secret: string;

  @Prop({})
  expirationDate: Date;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;

  @Prop({})
  updatedBy: string;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);
