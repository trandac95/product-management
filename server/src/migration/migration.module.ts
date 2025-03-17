import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from '../modules/auth/auth.module';
import { MigrationUserSeed } from './seeds/user.seeder';
import { ProductModule } from 'src/modules/product/product.module';
import { MigrationProductSeed } from './seeds/product.seeder';
@Module({
    imports: [
        CommandModule,
        AuthModule,
        // UserModule,
        ProductModule,
    ],
    providers: [
        // MigrationUserSeed,
        MigrationProductSeed,
    ],
    exports: [],
})
export class MigrationModule { }
