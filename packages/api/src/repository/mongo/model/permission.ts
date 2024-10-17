import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Target } from 'src/server/permission/entity';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: 'object' })
  target: Target;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  updatedBy: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
