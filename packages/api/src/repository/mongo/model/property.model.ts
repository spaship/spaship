import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  namespace: string;

  @Prop({})
  deploymentConnectionRecord: DeploymentConnectionRecord[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export class DeploymentConnectionRecord {
  deploymentConnectionName: string;

  cluster: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
