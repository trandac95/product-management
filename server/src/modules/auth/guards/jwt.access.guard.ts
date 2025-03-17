import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwtAccess') {
    handleRequest<T = { sub: string, email: string }>(
        err: Error,
        user: T,
        info: Error
    ): T {
        if (err || !user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
