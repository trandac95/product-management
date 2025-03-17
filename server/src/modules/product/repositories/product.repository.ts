import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BaseRepository } from '../../../common/base/base.repository';
import { Product } from './schemas/product.schema';
import { QueryProductDto } from '../dtos/query-product.dto';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>
    ) {
        super(productModel);
    }

    async findWithPagination(queryDto: QueryProductDto) {
        const { page = 1, limit = 10, search, category, subcategory, sortBy = 'createdAt', sortOrder = 'desc' } = queryDto;
        const skip = (page - 1) * limit;

        // Build filter
        const filter: FilterQuery<Product> = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            filter.category = category;
        }

        if (subcategory) {
            filter.subcategory = subcategory;
        }

        // Build sort
        const sort = sortOrder === 'asc' ? sortBy : `-${sortBy}`;

        // Execute query with pagination
        const [items, totalItems] = await Promise.all([
            this.productModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.productModel.countDocuments(filter).exec(),
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalItems / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;

        return {
            items,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNext,
                hasPrevious,
            },
        };
    }
}