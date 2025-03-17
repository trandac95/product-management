import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized.exception';
import { BadRequestException } from '../../../common/exceptions/bad-request.exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('auth.ERROR.USER_NOT_FOUND');
        }

        try {
            const isMatch = await bcrypt.compare(password, user.hashPassword);
            if (!isMatch) {
                throw new UnauthorizedException('auth.ERROR.INVALID_CREDENTIALS');
            }

            const { password: _, ...result } = user.toObject();
            return result;
        } catch (error) {
            console.error('Password comparison error:', error);
            throw new UnauthorizedException('auth.ERROR.INVALID_CREDENTIALS');
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const user = await this.validateUser(loginDto.email, loginDto.password);

            const payload = { sub: user._id, email: user.email };
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(payload),
                this.jwtService.signAsync(payload, {
                    expiresIn: this.configService.get('auth.refreshTokenExpiresIn'),
                }),
            ]);

            return {
                user,
                tokens: {
                    accessToken,
                    refreshToken,
                },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new BadRequestException('auth.ERROR.LOGIN_FAILED');
        }
    }

    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            this.configService.get('auth.bcryptSaltRounds'),
        );

        const user = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
        });

        const payload = { sub: user._id, email: user.email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('auth.refreshTokenExpiresIn'),
            }),
        ]);

        const { password, ...result } = user.toObject();
        return {
            user: result,
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }

    async refreshToken(token: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            const payload = { sub: decoded.sub, email: decoded.email };
            const accessToken = await this.jwtService.signAsync(payload);

            return { accessToken };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}