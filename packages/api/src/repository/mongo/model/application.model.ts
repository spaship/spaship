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

  @Prop({})
  isContainerized: boolean;

  @Prop({})
  imageUrl: string;

  @Prop({ type: 'object' })
  config: object;

  @Prop({})
  healthCheckPath: string;

  @Prop({ default: 1 })
  version: number;

  @Prop({})
  port: number;

  @Prop({})
  isGit: boolean;

  @Prop({})
  repoUrl: string;

  @Prop({})
  gitRef: string;

  @Prop({})
  contextDir: string;

  @Prop({ type: 'object' })
  buildArgs: object;

  @Prop({})
  commitId: string;

  @Prop({})
  mergeId: string;

  @Prop({ default: 'NA' })
  createdBy: string;

  @Prop({ default: 'NA' })
  updatedBy: string;

  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
