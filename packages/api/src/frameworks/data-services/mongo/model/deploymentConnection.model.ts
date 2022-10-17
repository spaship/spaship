import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { DeploymentRecord } from ".";

export type DeploymentConnectionDocument = DeploymentConnection & Document;

@Schema({ timestamps: true })
export class DeploymentConnection {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  alias: string;

  @Prop({ required: true })
  baseurl: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  isActive: boolean;
}

export const DeploymentConnectionSchema = SchemaFactory.createForClass(DeploymentConnection);
