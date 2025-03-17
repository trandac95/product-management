import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class NotFoundException extends AppException {
    constructor(key: string = 'common.ERROR.NOT_FOUND', data?: any) {
        super(key, HttpStatus.NOT_FOUND, data);
    }
} 