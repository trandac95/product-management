import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 27017,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    uri: process.env.MONGODB_URI,
}));