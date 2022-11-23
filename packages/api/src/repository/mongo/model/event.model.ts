import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  traceId: string;

  @Prop({ required: true })
  propertyIdentifier: string;

  @Prop({ required: true })
  applicationIdentifier: string;

  @Prop({ required: true })
  env: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  accessUrl: string;

  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, default: false })
  failure: boolean;

  @Prop({ required: true, default: true })
  isActive: boolean;

  createdAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
