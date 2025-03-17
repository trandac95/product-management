import { Command, Option } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { ProductSeederService } from './product.seeder';

@Injectable()
export class SeedCommand {
    private readonly logger = new Logger(SeedCommand.name);

    constructor(
        private readonly productSeederService: ProductSeederService,
    ) { }

    @Command({
        command: 'seed:products',
        describe: 'Seed database with sample products',
    })
    async run(
        @Option({
            name: 'count',
            description: 'Number of products to seed',
            type: 'number',
            default: 50,
        })
        count: number,

        @Option({
            name: 'clear',
            description: 'Clear existing products before seeding',
            type: 'boolean',
            default: true,
        })
        clear: boolean,

        @Option({
            name: 'min-price',
            description: 'Minimum product price',
            type: 'number',
            default: 10,
        })
        minPrice: number,

        @Option({
            name: 'max-price',
            description: 'Maximum product price',
            type: 'number',
            default: 1000,
        })
        maxPrice: number,
    ) {
        this.logger.log(`Starting product seed process with count=${count}, clear=${clear}...`);

        try {
            await this.productSeederService.seed({
                count,
                clearExisting: clear,
                priceMin: minPrice,
                priceMax: maxPrice,
            });
            this.logger.log('Product seeding completed successfully');
        } catch (error) {
            this.logger.error(`Error seeding products: ${error.message}`);
            throw error;
        }
    }
} 