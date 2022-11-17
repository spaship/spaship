import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentRecord } from 'src/server/property/property.entity';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  identifier: string;

  @Prop({ required: true })
  namespace: string;

  @Prop({})
  deploymentRecord: DeploymentRecord[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: 'NA' })
  updatedBy: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
