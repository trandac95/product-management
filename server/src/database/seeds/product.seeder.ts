import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../modules/product/repositories/schemas/product.schema';
import { faker } from '@faker-js/faker';

interface SeedOptions {
    count?: number;
    clearExisting?: boolean;
    categories?: string[];
    priceMin?: number;
    priceMax?: number;
}

@Injectable()
export class ProductSeederService {
    private readonly logger = new Logger(ProductSeederService.name);

    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
    ) { }

    async seed(options: SeedOptions = {}) {
        const {
            count = 50,
            clearExisting = true,
            categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'],
            priceMin = 10,
            priceMax = 1000
        } = options;

        this.logger.log(`Seeding ${count} products...`);

        try {
            // Clear existing products if requested
            if (clearExisting) {
                await this.productModel.deleteMany({});
                this.logger.log('Cleared existing products');
            }

            const subcategories = {
                Electronics: ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Cameras', 'Audio'],
                Clothing: ['Men', 'Women', 'Kids', 'Sportswear', 'Shoes', 'Accessories'],
                Books: ['Fiction', 'Non-fiction', 'Educational', 'Comics', 'Children', 'Biography'],
                'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Bathroom', 'Lighting'],
                Sports: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports', 'Cycling'],
                Toys: ['Action Figures', 'Board Games', 'Dolls', 'Educational', 'Outdoor', 'Puzzles']
            };

            const products = [];
            for (let i = 0; i < count; i++) {
                const category = faker.helpers.arrayElement(categories);
                const subcategory = faker.helpers.arrayElement(subcategories[category] || ['Default']);

                products.push({
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: parseFloat(faker.commerce.price({ min: priceMin, max: priceMax })),
                    category,
                    subcategory,
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                });
            }

            const result = await this.productModel.insertMany(products);
            this.logger.log(`Successfully seeded ${result.length} products`);
            return result;
        } catch (error) {
            this.logger.error(`Error seeding products: ${error.message}`);
            throw error;
        }
    }
} 