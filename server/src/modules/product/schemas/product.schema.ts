import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../common/base/base.schema';

@Schema({ timestamps: true })
export class Product extends BaseSchema {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: string;

    @Prop({ required: true })
    category: string;

    @Prop()
    subcategory: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add indexes for better query performance
ProductSchema.index({ name: 'text', category: 'text', subcategory: 'text', price: 'text' });
