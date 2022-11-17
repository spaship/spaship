import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  _id: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  propertyIdentifier: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  env: string;

  @Prop({ required: true })
  path: string;

  @Prop({})
  ref: string;

  @Prop({ required: true })
  nextRef: string;

  @Prop({})
  accessUrl: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ default: 'NA' })
  createdBy: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
