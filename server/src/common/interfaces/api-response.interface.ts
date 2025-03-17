import { ApiProperty } from '@nestjs/swagger';

export interface PaginationMeta {
    page: number;
    perPage: number;
    totalPages: number;
    total: number;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: PaginationMeta;
}

export interface ApiErrorResponse extends ApiResponse<null> {
    errors?: Record<string, string[]>;
}

export class PaginationResponse {
    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 10 })
    limit: number;

    @ApiProperty({ example: 100 })
    totalItems: number;

    @ApiProperty({ example: 10 })
    totalPages: number;

    @ApiProperty({ example: true })
    hasNext: boolean;

    @ApiProperty({ example: true })
    hasPrevious: boolean;
}

export class ListResponse<T> {
    @ApiProperty()
    items: T[];

    @ApiProperty({ type: PaginationResponse })
    pagination: PaginationResponse;
}

export class ApiSuccessResponse<T> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Operation completed successfully' })
    message: string;

    @ApiProperty()
    data: T;

    @ApiProperty({ type: PaginationResponse, required: false })
    pagination?: PaginationResponse;
}

export class ApiErrorResponse {
    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: 'Error message' })
    message: string;

    @ApiProperty({ example: 'ERROR_CODE' })
    error: string;
} 