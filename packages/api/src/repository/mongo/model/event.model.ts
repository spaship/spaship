import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  traceId: string;

  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  spaName: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  env: string;

  @Prop({ required: true })
  branch: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  accessUrl: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  failure: string;

  @Prop({ required: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
