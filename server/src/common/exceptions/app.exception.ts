import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
    constructor(
        key: string,
        statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
        data?: any
    ) {
        super(
            {
                key,
                statusCode,
                timestamp: new Date().toISOString(),
                data,
            },
            statusCode
        );
    }
} 