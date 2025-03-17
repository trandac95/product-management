import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/base/base.service';
import { Product } from '../repositories/schemas/product.schema';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { QueryProductDto } from '../dtos/query-product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { IQueryOptions } from '../../../common/interfaces/base.interface';
import { Types } from 'mongoose';
import { BadRequestException } from '../../../common/exceptions/bad-request.exception';
import { ListResponse } from '../../../common/interfaces/api-response.interface';

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
        private readonly productRepository: ProductRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        super(productRepository);
    }

    async findAll(queryDto: QueryProductDto): Promise<ListResponse<Product>> {
        const cacheKey = `products_${JSON.stringify(queryDto)}`;

        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData as ListResponse<Product>;
        }

        const result = await this.productRepository.findWithPagination(queryDto);

        await this.cacheManager.set(cacheKey, result, 300);

        return result;
    }

    async findWithQuery(query: QueryProductDto) {
        const { page = 1, limit = 10, search } = query;

        const filter: any = { isDeleted: false };

        if (search) {
            filter.$text = { $search: search };
        }

        const [items, total] = await Promise.all([
            this.productRepository
                .find(filter, { page, limit }),
            this.productRepository.count(filter),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string): Promise<Product> {
        try {
            const product = await super.findById(id);
            if (!product) {
                throw new NotFoundException('product.ERROR.NOT_FOUND');
            }
            return product;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('product.ERROR.INVALID_ID');
        }
    }

    async create(createProductDto: CreateProductDto) {
        try {
            const product = await super.create(createProductDto);
            return product;
        } catch (error) {
            throw new BadRequestException('product.ERROR.CREATE_FAILED', createProductDto);
        }
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        try {
            const updatedProduct = await this.productRepository.update(id, updateProductDto);
            return updatedProduct;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('product.ERROR.UPDATE_FAILED');
        }
    }

    async remove(id: string) {
        try {
            const product = await this.productRepository.delete(id);
            return { id };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('product.ERROR.DELETE_FAILED');
        }
    }

    async search(query: string, options: IQueryOptions) {
        const cacheKey = `product_search_${query}_${JSON.stringify(options)}`;
        const cachedResult = await this.cacheManager.get(cacheKey);

        if (cachedResult) {
            return cachedResult;
        }

        const searchOptions = {
            ...options,
            filter: {
                name: { $text: { $search: query } }
            }
        };

        const result = await this.productRepository.find(searchOptions);
        await this.cacheManager.set(cacheKey, result, 300); // Cache for 5 minutes
        return result;
    }

    async deleteMany(filter: any) {
        return this.productRepository.deleteMany(filter);
    }

    async toggleLike(productId: string, userId: string) {
        const product = await this.findById(productId);
        if (!product) {
            throw new NotFoundException('product.ERROR.NOT_FOUND');
        }

        const isLiked = product.likedBy.includes(userId);
        if (isLiked) {
            product.likedBy = product.likedBy.filter(like => like !== userId);
        } else {
            product.likedBy.push(userId);
        }

        await product.save();
        await this.invalidateProductCache();
        return product;
    }

    private async invalidateProductCache() {
        try {
            const keys = this.cacheManager.stores.keys;

            if (!keys || !Array.isArray(keys)) {
                return;
            }

            // Tìm và xóa tất cả các keys liên quan đến products
            const productKeys = keys.filter(key =>
                key.startsWith('products_') ||
                key.startsWith('product_search_')
            );

            // Xóa từng key
            const deletePromises = productKeys.map(key => this.cacheManager.del(key));
            await Promise.all(deletePromises);

            console.log(`Đã xóa ${productKeys.length} cache keys sau khi like/unlike sản phẩm`);
        } catch (error) {
            console.error('Lỗi khi xóa cache sản phẩm:', error);
        }
    }
}