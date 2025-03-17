import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query
} from '@nestjs/common';
import {
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { ApiPaginatedResponse } from '../../../common/decorators/api-response.decorator';
import {
    ApiCreate,
    ApiDelete,
    ApiGetById,
    ApiUpdate
} from '../../../common/decorators/swagger.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/schemas/user.schema';
import { CreateProductDto } from '../dtos/create-product.dto';
import { QueryProductDto } from '../dtos/query-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../repositories/schemas/product.schema';
import { ProductLikeService } from '../services/product-like.service';
import { ProductService } from '../services/product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly productLikeService: ProductLikeService,
        private readonly i18nService: I18nService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all products with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by product name' })
    @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
    @ApiPaginatedResponse(Product)
    async findAll(@Query() queryDto: QueryProductDto) {
        const { items, pagination } = await this.productService.findAll(queryDto);
        return {
            message: this.i18nService.translate('product.SUCCESS.LIST_RETRIEVED'),
            items,
            pagination
        };
    }

    @Get('search')
    @ApiOperation({ summary: 'Search products by name' })
    @ApiQuery({
        name: 'q',
        required: true,
        type: String,
        description: 'Search query string',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns matching products',
        schema: {
            example: {
                success: true,
                message: 'Products retrieved successfully',
                data: [
                    {
                        _id: '123',
                        name: 'iPhone 14',
                        price: 999.99,
                        description: 'Latest iPhone model'
                    }
                ],
                pagination: {
                    page: 1,
                    limit: 10,
                    totalItems: 1,
                    totalPages: 1
                }
            }
        }
    })
    async search(
        @Query('q') search: string,
        @Query() queryDto: QueryProductDto
    ) {
        if (search) {
            queryDto.search = search;
        }
        const products = await this.productService.findAll(queryDto);
        return {
            message: this.i18nService.translate('product.SUCCESS.SEARCHED'),
            data: products
        };
    }

    @Get(':id')
    @ApiGetById('product')
    async findOne(@Param('id') id: string) {
        const product = await this.productService.findById(id);
        if (!product) {
            throw new NotFoundException(
                this.i18nService.translate('product.ERROR.NOT_FOUND')
            );
        }
        return {
            message: this.i18nService.translate('product.SUCCESS.RETRIEVED'),
            data: product
        };
    }

    @Post()
    @Auth()
    @ApiCreate('product')
    async create(@Body() createProductDto: CreateProductDto) {
        const product = await this.productService.create(createProductDto);
        return {
            message: this.i18nService.translate('product.SUCCESS.CREATED'),
            data: product
        };
    }

    @Put(':id')
    @Auth()
    @ApiUpdate('product')
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        const product = await this.productService.update(id, updateProductDto);
        return {
            message: this.i18nService.translate('product.SUCCESS.UPDATED'),
            data: product
        };
    }

    @Delete(':id')
    @Auth()
    @ApiDelete('product')
    async remove(@Param('id') id: string) {
        await this.productService.delete(id);
        return {
            message: this.i18nService.translate('product.SUCCESS.DELETED'),
        };
    }

    @Post(':id/like')
    @Auth()
    @ApiOperation({ summary: 'Toggle like on a product' })
    async toggleLike(
        @Param('id') id: string,
        @CurrentUser() user: User,
    ) {

        const product = await this.productService.toggleLike(id, user._id);

        return {
            message: this.i18nService.translate('product.SUCCESS.TOGGLED_LIKE'),
            data: product
        };
    }


}