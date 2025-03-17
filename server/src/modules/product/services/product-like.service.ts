import { Injectable, ConflictException } from '@nestjs/common';
import { BaseService } from '../../../common/base/base.service';
import { ProductLike } from '../repositories/schemas/product-like-schema';
import { ProductLikeRepository } from '../repositories/product-like.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class ProductLikeService extends BaseService<ProductLike> {
    constructor(
        private readonly productLikeRepository: ProductLikeRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        super(productLikeRepository);
    }

    async toggleLike(productId: string, userId: string): Promise<{ liked: boolean; totalLikes: number }> {
        const existingLike = await this.productLikeRepository.findByProductAndUser(productId, userId);

        if (existingLike) {
            await this.productLikeRepository.delete(existingLike._id);
            await this.clearCache(productId);
            const totalLikes = await this.productLikeRepository.countByProduct(productId);
            return { liked: false, totalLikes };
        }

        try {
            await this.productLikeRepository.create({ productId, userId });
            await this.clearCache(productId);
            const totalLikes = await this.productLikeRepository.countByProduct(productId);
            return { liked: true, totalLikes };
        } catch (error) {
            if (error.code === 11000) { // Duplicate key error
                throw new ConflictException('User has already liked this product');
            }
            throw error;
        }
    }

    async getLikeStatus(productId: string, userId: string): Promise<boolean> {
        const like = await this.productLikeRepository.findByProductAndUser(productId, userId);
        return !!like;
    }

    async getProductLikes(productId: string): Promise<number> {
        const cacheKey = `product:${productId}:likes`;
        const cachedCount = await this.cacheManager.get<number>(cacheKey);

        if (cachedCount !== undefined) {
            return cachedCount;
        }

        const count = await this.productLikeRepository.countByProduct(productId);
        await this.cacheManager.set(cacheKey, count, 300); // Cache for 5 minutes
        return count;
    }

    private async clearCache(productId: string): Promise<void> {
        await this.cacheManager.del(`product:${productId}:likes`);
    }
}