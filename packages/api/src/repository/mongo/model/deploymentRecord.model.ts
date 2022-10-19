import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PromiseProvider } from "mongoose";

export type DeploymentRecordDocument = DeploymentRecord & Document;

@Schema({ timestamps: true })
export class DeploymentRecord {
  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  deploymentConnectionName: string;

  @Prop({ required: true })
  type: string;
}

export const DeploymentRecordSchema = SchemaFactory.createForClass(DeploymentRecord);
