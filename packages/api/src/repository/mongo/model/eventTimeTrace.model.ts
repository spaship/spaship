import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type EventTimeTraceDocument = EventTimeTrace & Document;

@Schema({ timestamps: true })
export class EventTimeTrace {
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
  initialCode: string;

  @Prop({ required: true })
  finalCode: string;

  @Prop({ required: true })
  failure: string;

  @Prop({ required: true })
  consumedTime: string;

  @Prop({ required: true })
  isActive: boolean;
}

export const EventTimeTraceSchema = SchemaFactory.createForClass(EventTimeTrace);
