import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class BadRequestException extends AppException {
    constructor(
        key: string = 'common.ERROR.BAD_REQUEST',
        data?: any,
        public readonly errors?: Record<string, any>
    ) {
        super(key, HttpStatus.BAD_REQUEST, data);
    }
} 