import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class UnauthorizedException extends AppException {
    constructor(key: string = 'common.ERROR.UNAUTHORIZED', data?: any) {
        super(key, HttpStatus.UNAUTHORIZED, data);
    }
} 