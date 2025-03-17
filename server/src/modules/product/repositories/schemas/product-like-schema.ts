import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../../common/base/base.schema';

@Schema({ timestamps: true })
export class ProductLike extends BaseSchema {
    @Prop({ required: true, index: true })
    productId: string;

    @Prop({ required: true, index: true })
    userId: string;
}

export const ProductLikeSchema = SchemaFactory.createForClass(ProductLike);

// Create a compound unique index to prevent duplicate likes
ProductLikeSchema.index({ productId: 1, userId: 1 }, { unique: true });