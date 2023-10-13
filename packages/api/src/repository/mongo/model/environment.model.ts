import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Cluster, Symlink } from 'src/server/environment/environment.entity';

export type EnvironmentDocument = Environment & Document;

@Schema({ timestamps: true })
export class Environment {
  @Prop({ required: true })
  propertyIdentifier: string;

  @Prop({})
  url: string;

  @Prop({ required: true, enum: Cluster })
  cluster: string;

  @Prop({ required: true, default: false })
  isEph: boolean;

  @Prop({ default: 'NA' })
  sync: string;

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

  @Prop({})
  symlink: Symlink;

  @Prop({ default: 'NA' })
  updatedBy: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);
