import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product, ProductSchema } from '../../modules/product/repositories/schemas/product.schema';
import databaseConfig from '../../configs/database.config';
import appConfig from '../../configs/app.config';
import authConfig from '../../configs/auth.config';
import { CommandModule } from 'nestjs-command';
import { SeedCommand } from './seed.command';
import { ProductSeederService } from './product.seeder';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig, authConfig],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri')
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
        ]),
        CommandModule,
    ],
    providers: [SeedCommand, ProductSeederService],
})
export class SeederModule { } 