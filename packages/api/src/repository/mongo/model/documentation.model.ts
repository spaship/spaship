import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DocumentationDocument = Documentation & Document;

@Schema({ timestamps: true })
export class Documentation {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  tags: string;

  @Prop({ required: true })
  section: string;

  @Prop({ default: false })
  isVideo: boolean;

  @Prop({ default: 'NA' })
  createdBy: string;

  @Prop({ default: 'NA' })
  updatedBy: string;
}

export const DocumentationSchema = SchemaFactory.createForClass(Documentation);
