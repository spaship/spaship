import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventTimeTraceDocument = EventTimeTrace & Document;

@Schema({ timestamps: true })
export class EventTimeTrace {
  @Prop({ required: true })
  traceId: string;

  @Prop({ required: true })
  propertyIdentifier: string;

  @Prop({ required: true })
  applicationIdentifier: string;

  @Prop({ required: true })
  env: string;

  @Prop({})
  cluster: string;

  @Prop({})
  type: string;

  @Prop({ required: true })
  consumedTime: string;

  @Prop({ required: true, default: false })
  failure: boolean;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const EventTimeTraceSchema = SchemaFactory.createForClass(EventTimeTrace);
