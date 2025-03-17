import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { BaseRepository } from './base.repository';
import { BaseSchema } from './base.schema';

@Injectable()
export class BaseService<T extends BaseSchema> {
    constructor(protected readonly repository: BaseRepository<T>) { }

    async findAll(options: any = {}) {
        return this.repository.findWithPagination(options);
    }

    async findById(id: string) {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new NotFoundException('Item not found');
        }
        return item;
    }

    async create(data: Partial<T>) {
        return this.repository.create(data);
    }

    async update(id: string, data: Partial<T>) {
        return this.repository.update(id, data);
    }

    async delete(id: string) {
        return this.repository.softDelete(id);
    }

    async count(filter: FilterQuery<T>) {
        return this.repository.count(filter);
    }
}