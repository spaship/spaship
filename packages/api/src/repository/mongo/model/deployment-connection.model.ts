import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeploymentConnectionDocument = DeploymentConnection & Document;

@Schema({ timestamps: true })
export class DeploymentConnection {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  baseurl: string;

  @Prop({ required: true })
  cluster: string;

  @Prop({ required: true, default: 0 })
  weight: number;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const DeploymentConnectionSchema = SchemaFactory.createForClass(DeploymentConnection);
