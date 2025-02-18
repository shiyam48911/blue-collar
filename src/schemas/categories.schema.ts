import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false, timestamps: true })
export class Categories extends Document {
    @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
    _id!: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: [Types.ObjectId]})
    blueCollarIds: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Categories);