import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ApplicationDocument = Application & Document;

@Schema()
export class Application {
  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  spaName: string;

  @Prop({ required: true })
  path: string;

  @Prop({})
  ref: string;

  @Prop({})
  nextRef: string;

  @Prop({ required: true })
  namespace: string;

  @Prop({})
  accessUrl: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
