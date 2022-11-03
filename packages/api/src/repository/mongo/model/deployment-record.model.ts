import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PromiseProvider } from 'mongoose';

export type DeploymentRecordDocument = DeploymentRecord & Document;

@Schema({ timestamps: true })
export class DeploymentRecord {
  @Prop({ required: true })
  cluster: string;

  @Prop({ required: true })
  name: string;
}

export const DeploymentRecordSchema = SchemaFactory.createForClass(DeploymentRecord);
