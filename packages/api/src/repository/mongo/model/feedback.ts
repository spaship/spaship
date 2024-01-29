import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  experience: string;

  @Prop({ default: 'NA' })
  createdBy: string;

  @Prop({ default: 'NA' })
  updatedBy: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
