import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type EnvironmentDocument = Environment & Document;

@Schema({ timestamps: true })
export class Environment {
  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  culster: string;

  @Prop({ required: true })
  isEph: boolean;

  @Prop({})
  url: string;

  @Prop({})
  actionEnabled: boolean;

  @Prop({})
  actionId: string;

  @Prop({})
  env: string;

  @Prop({})
  expiresIn: string;

  @Prop({})
  agendaId: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  isActive: boolean;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);
