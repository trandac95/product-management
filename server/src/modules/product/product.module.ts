import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './controllers/product.controller';
import { ProductLikeRepository } from './repositories/product-like.repository';
import { ProductRepository } from './repositories/product.repository';
import { Product, ProductSchema } from './repositories/schemas/product.schema';
import { ProductLikeService } from './services/product-like.service';
import { ProductService } from './services/product.service';
import { ProductLike, ProductLikeSchema } from './repositories/schemas/product-like-schema';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }, { name: ProductLike.name, schema: ProductLikeSchema }]),
        CacheModule.register(),
        AuthModule,
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository, ProductLikeService, ProductLikeRepository],
    exports: [ProductService],
})
export class ProductModule { }