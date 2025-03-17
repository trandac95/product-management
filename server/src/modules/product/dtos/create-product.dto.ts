import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'The name of the product',
        example: 'iPhone 14 Pro'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The price of the product',
        example: '999.99'
    })
    @IsString()
    price: string;

    @ApiProperty({
        description: 'The description of the product',
        required: false,
        example: 'The latest iPhone model'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'Electronics' })
    @IsString()
    category: string;

    @ApiProperty({ example: 'Smartphones', required: false })
    @IsString()
    @IsOptional()
    subcategory?: string;
}