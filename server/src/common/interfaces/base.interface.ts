export interface IBaseEntity {
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}

export interface IPagination {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    skip?: number;
}

export interface IQueryOptions extends IPagination {
    select?: string[];
    populate?: string[] | Record<string, any>[];
}

export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string, options?: IQueryOptions): Promise<T>;
    findOne(filter: Partial<T>, options?: IQueryOptions): Promise<T>;
    find(filter: Partial<T>, options?: IQueryOptions): Promise<T[]>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
    softDelete(id: string): Promise<boolean>;
    count(filter: Partial<T>): Promise<number>;
}