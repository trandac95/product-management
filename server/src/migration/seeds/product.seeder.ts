import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ProductService } from '../../modules/product/services/product.service';
import { CreateProductDto } from '../../modules/product/dtos/create-product.dto';
@Injectable()
export class MigrationProductSeed {
    constructor(private readonly productService: ProductService) { }

    @Command({
        command: 'seed:product',
        describe: 'seeds products',
    })
    async seeds(): Promise<void> {
        try {
            const data: CreateProductDto = {
                name: 'Product 1',
                description: 'Description 1',
                price: '100',
                category: 'Category 1',
            };

            await this.productService.create(data);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:product',
        describe: 'remove products',
    })
    async remove(): Promise<void> {
        try {
            await this.productService.deleteMany({});
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
