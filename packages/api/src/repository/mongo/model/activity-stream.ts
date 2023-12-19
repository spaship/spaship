import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Action, Props } from 'src/server/analytics/entity';

export type ActivityStreamDocument = ActivityStream & Document;

@Schema({ timestamps: true })
export class ActivityStream {
  @Prop({ required: true })
  propertyIdentifier: string;

  @Prop({ required: true, enum: Action })
  action: string;

  @Prop({ required: true })
  props: Props;

  @Prop({ required: true, default: 'NA' })
  message: string;

  @Prop({ required: true, default: 'NA' })
  payload: string;

  @Prop({ required: true, default: 'Manager' })
  source: string;

  @Prop({ default: 'NA' })
  createdBy: string;
}

export const ActivityStreamSchema = SchemaFactory.createForClass(ActivityStream);
