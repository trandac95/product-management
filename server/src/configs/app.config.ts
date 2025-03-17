import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    env: process.env.APP_ENV || 'development',
    name: process.env.APP_NAME || 'NestJS API',
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    prefix: process.env.APP_PREFIX || 'api',
    version: process.env.APP_VERSION || '1',
    fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
}));
