import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthJwtAccessGuard } from '../guards/jwt.access.guard';

export function Auth() {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}