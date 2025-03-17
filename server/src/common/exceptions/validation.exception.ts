import { BadRequestException } from './bad-request.exception';

export class ValidationException extends BadRequestException {
    constructor(errors: Record<string, string>) {
        super('common.ERROR.VALIDATION_FAILED', null, errors);
    }
} 