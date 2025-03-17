import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { Logger } from '@nestjs/common';
import { SeederModule } from './database/seeds/seeder.module';

async function bootstrap() {
    const logger = new Logger('Seed CLI');

    try {
        const app = await NestFactory.createApplicationContext(SeederModule, {
            logger: ['error', 'warn', 'log'],
        });

        logger.log('Seed CLI started');

        try {
            await app
                .select(CommandModule)
                .get(CommandService)
                .exec();

            logger.log('Seed command executed successfully');
        } catch (error) {
            logger.error(`Command execution failed: ${error.message}`);
        } finally {
            await app.close();
            logger.log('Seed CLI finished');
        }
    } catch (error) {
        logger.error(`Failed to create application context: ${error.message}`);
    }
}

bootstrap();
