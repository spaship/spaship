import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuthActionLookupDocument = AuthActionLookup & Document;

@Schema({ timestamps: true })
export class AuthActionLookup {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  resource: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const AuthActionLookupSchema = SchemaFactory.createForClass(AuthActionLookup);
