import { Document, Model, FilterQuery, UpdateQuery, DeleteResult, SortOrder } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { IBaseRepository, IQueryOptions } from '../interfaces/base.interface';
import { ListResponse, PaginationResponse } from '../interfaces/api-response.interface';
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        const entity = new this.model(data);
        return entity.save();
    }

    async findById(id: string, options?: IQueryOptions): Promise<T> {
        const query = this.model.findById(id);
        this.applyQueryOptions(query, options);
        const document = await query.exec();

        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }
        return document;
    }

    async findOne(filter: FilterQuery<T>, options?: IQueryOptions): Promise<T> {
        const query = this.model.findOne({ ...filter, isDeleted: false });
        this.applyQueryOptions(query, options);
        return query.exec();
    }

    async find(filter: FilterQuery<T>, options?: IQueryOptions): Promise<T[]> {
        const query = this.model.find({ ...filter, isDeleted: false });
        this.applyQueryOptions(query, options);
        return query;
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T> {
        const document = await this.model
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }
        return document;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }

    async deleteMany(query: any): Promise<DeleteResult> {
        return this.model.deleteMany(query).exec();
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.model
            .findByIdAndUpdate(id, {
                isDeleted: true,
                deletedAt: new Date(),
            })
            .exec();
        return !!result;
    }

    async count(filter: FilterQuery<T>): Promise<number> {
        return this.model.countDocuments({ ...filter, isDeleted: false }).exec();
    }

    async findWithPagination(
        filter: FilterQuery<T> = {},
        page: number = 1,
        limit: number = 10,
        sort: Record<string, SortOrder> = { createdAt: -1 }
    ): Promise<ListResponse<T>> {
        const skip = (page - 1) * limit;

        const [items, totalItems] = await Promise.all([
            this.model
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.model.countDocuments(filter).exec(),
        ]);

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

    private applyQueryOptions(query: any, options?: IQueryOptions): void {

        if (!options) return;

        if (options.select) {
            query.select(options.select.join(' '));
        }

        if (options.populate) {
            options.populate.forEach(populateOption => {
                query.populate(populateOption);
            });
        }

        if (options.page && options.limit) {

            const skip = (options.page - 1) * options.limit;
            query.skip(skip).limit(options.limit);
        }

        if (options.sort) {
            query.sort(options.sort);
        }
    }
}