import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/base/base.repository';
import { ProductLike } from './schemas/product-like-schema';

@Injectable()
export class ProductLikeRepository extends BaseRepository<ProductLike> {
    constructor(
        @InjectModel(ProductLike.name) private readonly productLikeModel: Model<ProductLike>
    ) {
        super(productLikeModel);
    }

    async findByProductAndUser(productId: string, userId: string): Promise<ProductLike | null> {
        return this.findOne({ productId, userId });
    }

    async countByProduct(productId: string): Promise<number> {
        return this.count({ productId });
    }

    async findByProduct(productId: string): Promise<ProductLike[]> {
        return this.find({ productId });
    }

    async findByUser(userId: string): Promise<ProductLike[]> {
        return this.find({ userId });
    }
}