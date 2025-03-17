import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { AppException } from '../exceptions/app.exception';
import { BadRequestException } from '../exceptions/bad-request.exception';

@Catch(HttpException)
export class I18nExceptionFilter extends BaseExceptionFilter {
    constructor(private readonly i18n: I18nService) {
        super();
    }

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();

        const lang = request.i18nLang || 'en';

        if (exception instanceof BadRequestException && exception.errors) {
            const exceptionResponse = exception.getResponse() as any;

            const translatedMessage = await this.i18n.translate(exceptionResponse.key, {
                lang,
                args: exceptionResponse.data || {},
            });

            const translatedErrors = {};
            for (const [field, error] of Object.entries(exception.errors)) {
                if (typeof error === 'string' && error.includes('.')) {
                    try {
                        translatedErrors[field] = await this.i18n.translate(error, { lang });
                    } catch {
                        translatedErrors[field] = error;
                    }
                } else {
                    translatedErrors[field] = error;
                }
            }

            return response.status(status).json({
                success: false,
                message: translatedMessage,
                error: {
                    code: exceptionResponse.key,
                    statusCode: status,
                    timestamp: exceptionResponse.timestamp,
                    errors: translatedErrors
                }
            });
        }

        if (exception instanceof AppException) {
            const exceptionResponse = exception.getResponse() as any;
            const translatedMessage = await this.i18n.translate(exceptionResponse.key, {
                lang,
                args: exceptionResponse.data || {},
            });

            return response.status(status).json({
                success: false,
                message: translatedMessage,
                error: {
                    code: exceptionResponse.key,
                    statusCode: status,
                    timestamp: exceptionResponse.timestamp,
                }
            });
        }

        if (status === HttpStatus.BAD_REQUEST && exception.getResponse() && typeof exception.getResponse() === 'object') {
            const exceptionResponse = exception.getResponse() as any;

            if (Array.isArray(exceptionResponse.message)) {
                const validationErrors = {};

                for (const error of exceptionResponse.message) {
                    if (error.constraints) {
                        const constraints = Object.values(error.constraints);
                        validationErrors[error.property] = constraints[0];
                    }
                }

                return response.status(status).json({
                    success: false,
                    message: 'Validation failed',
                    error: {
                        statusCode: status,
                        timestamp: new Date().toISOString(),
                        errors: validationErrors
                    }
                });
            }
        }

        const message = exception.message;
        let translatedMessage = message;

        try {
            translatedMessage = await this.i18n.translate(message, {
                lang,
            });
        } catch (error) {
        }

        response.status(status).json({
            success: false,
            message: translatedMessage,
            error: {
                statusCode: status,
                error: exception.name,
                timestamp: new Date().toISOString(),
            }
        });
    }
} 