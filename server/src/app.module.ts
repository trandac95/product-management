import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule, AcceptLanguageResolver, HeaderResolver, QueryResolver, I18nJsonLoader } from 'nestjs-i18n';
import * as path from 'path';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import authConfig from './configs/auth.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CacheModule, CacheOptions } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { join } from 'path';

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
        // I18nModule.forRootAsync({
        //     useFactory: (configService: ConfigService) => ({
        //         fallbackLanguage: configService.get('app.fallbackLanguage'),
        //         loaderOptions: {
        //             path: join(__dirname, '/i18n/'),
        //             watch: true,
        //         },
        //     }),
        //     resolvers: [
        //         { use: QueryResolver, options: ['lang', 'locale', 'language'] },
        //         AcceptLanguageResolver,
        //         new HeaderResolver(['x-custom-lang']),
        //     ],
        //     inject: [ConfigService],
        // }),
        I18nModule.forRootAsync({
            loader: I18nJsonLoader,
            inject: [ConfigService],
            resolvers: [new HeaderResolver(['x-custom-lang'])],
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: configService.get<string>('app.fallbackLanguage'),
                loaderOptions: {
                    path: path.join(__dirname, 'i18n/'),
                    watch: true,
                },
            }),
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (
                configService: ConfigService
            ): Promise<CacheOptions> => ({
                max: configService.get<number>('redis.cached.max'),
                ttl: configService.get<number>('redis.cached.ttl'),
                stores: [
                    new KeyvRedis({
                        socket: {
                            host: configService.get<string>(
                                'redis.cached.host'
                            ),
                            port: configService.get<number>(
                                'redis.cached.port'
                            ),
                            tls: configService.get<boolean>('redis.cached.tls'),
                        },
                        username: configService.get<string>(
                            'redis.cached.username'
                        ),
                        password: configService.get<string>(
                            'redis.cached.password'
                        ),
                    }),
                ],
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        ProductModule,
    ],
})
export class AppModule { }