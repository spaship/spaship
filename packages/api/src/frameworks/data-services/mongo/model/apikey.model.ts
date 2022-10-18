import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ApikeyDocument = Apikey & Document;

@Schema({ timestamps: true })
export class Apikey {
  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  shortKey: string;

  @Prop({ required: true })
  hashKey: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  env: string[];

  @Prop({})
  label: string;

  @Prop({ required: true })
  expiredDate: string;

  @Prop({ required: true })
  createdBy: string;
}

export const ApikeySchema = SchemaFactory.createForClass(Apikey);
