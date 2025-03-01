import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false, timestamps: true })
export class BlueCollar extends Document {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id!: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true, unique: true })
  hourlyRate: number;

  @Prop({ required: true })
  rating: string;

  @Prop({ required: true,type:true })
  skills: string[];
}

export const BlueCollarSchema = SchemaFactory.createForClass(BlueCollar);