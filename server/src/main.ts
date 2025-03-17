import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ApiSuccessResponse, ApiErrorResponse } from './common/interfaces/api-response.interface';
import { I18nService } from 'nestjs-i18n';
import { I18nExceptionFilter } from './common/filters/i18n-exception.filter';
import { LanguageInterceptor } from './common/interceptors/language.interceptor';
import { CustomValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('app.prefix'));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get('app.version'),
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const config = new DocumentBuilder()
    .setTitle('Product Management API')
    .setDescription('The Product Management API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ApiSuccessResponse, ApiErrorResponse],
  });
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Product Management API Docs',
  });

  await app.listen(configService.get('app.port'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();