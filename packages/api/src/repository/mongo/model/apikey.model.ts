import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ApikeyDocument = Apikey & Document;

@Schema({ timestamps: true })
export class Apikey {
  @Prop({ required: true })
  propertyIdentifier: string;

  @Prop({ required: true })
  shortKey: string;

  @Prop({ required: true, unique: true })
  hashKey: string;

  @Prop({ required: true })
  env: string[];

  @Prop({})
  label: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  createdBy: string;

  createdAt: Date;
}

export const ApikeySchema = SchemaFactory.createForClass(Apikey);
