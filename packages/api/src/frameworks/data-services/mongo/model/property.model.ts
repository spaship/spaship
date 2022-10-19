import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  propertyTitle: string;

  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  namespace: string;

  @Prop({})
  deploymentConnectionRecord: DeploymentConnectionRecord[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  isActive: boolean;
}

export class DeploymentConnectionRecord {
  deploymentConnectionName: string;

  cluster: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
