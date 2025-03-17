import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', default: 10 })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Search by product name' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by category' })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({ description: 'Filter by subcategory' })
    @IsString()
    @IsOptional()
    subcategory?: string;

    @ApiPropertyOptional({ description: 'Sort field', example: 'price' })
    @IsString()
    @IsOptional()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
    @IsString()
    @IsOptional()
    sortOrder?: 'asc' | 'desc' = 'desc';
}