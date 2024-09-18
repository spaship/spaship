import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Symlink, VirtualPath } from 'src/server/application/entity';

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
  virtualPaths: VirtualPath[];

  @Prop({})
  ref: string;

  @Prop({ required: true })
  nextRef: string;

  @Prop({})
  accessUrl: string[];

  @Prop({})
  routerUrl: string[];

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({})
  isContainerized: boolean;

  @Prop({})
  imageUrl: string;

  @Prop({ type: 'object' })
  config: object;

  @Prop({ type: 'object' })
  secret: object;

  @Prop({})
  healthCheckPath: string;

  @Prop({})
  requiredCpu: string;

  @Prop({})
  requiredMemory: string;

  @Prop({})
  limitCpu: string;

  @Prop({})
  limitMemory: string;

  @Prop({})
  replicas: string;

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

  @Prop({})
  buildArgs: object[];

  @Prop({})
  commitDetails: object[];

  @Prop({})
  pipelineDetails: object[];

  @Prop({})
  mergeDetails: object[];

  @Prop({})
  gitProjectId: string;

  @Prop({})
  buildName: object[];

  @Prop({})
  dockerFileName: string;

  @Prop({ default: false })
  autoSync: boolean;

  @Prop({})
  symlink: Symlink[];

  @Prop({})
  autoSymlinkCreation: boolean;

  @Prop({ default: false })
  autoGenerateLHReport: boolean;

  @Prop({ default: 'NA' })
  cmdbCode: string;

  @Prop({ default: 'NA' })
  severity: string;

  @Prop({ default: 'NA' })
  createdBy: string;

  @Prop({ default: 'NA' })
  updatedBy: string;

  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
