import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dts';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nService } from 'nestjs-i18n';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly i18nService: I18nService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        schema: {
            example: {
                success: true,
                message: 'Login successful',
                data: {
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    user: {
                        id: '123',
                        email: 'user@example.com',
                        name: 'John Doe'
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(
        @Body() loginDto: LoginDto
    ) {
        const result = await this.authService.login(loginDto);
        return {
            message: this.i18nService.translate('auth.SUCCESS.LOGIN'),
            data: result
        };
    }

    @Post('register')
    @ApiOperation({ summary: 'User registration' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: 'Registration successful',
        schema: {
            example: {
                success: true,
                message: 'Registration successful',
                data: {
                    id: '123',
                    email: 'user@example.com',
                    name: 'John Doe'
                }
            }
        }
    })
    async register(
        @Body() registerDto: RegisterDto,
    ) {
        const result = await this.authService.register(registerDto);
        return {
            message: this.i18nService.translate('user.SUCCESS.CREATED'),
            data: result
        };
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    @Get('test-i18n')
    async testI18n(@Req() request: Request) {
        try {
            // Lấy ngôn ngữ từ request
            const lang = request.headers['x-custom-lang'] || 'en';

            // Test với nhiều cách
            const test1 = this.i18nService.translate('auth.SUCCESS.LOGIN', { lang: lang as string });
            const test2 = this.i18nService.translate('auth.SUCCESS.LOGIN', { lang: 'vi' });
            const test3 = this.i18nService.translate('auth.SUCCESS.LOGIN', { lang: 'en' });

            // Kiểm tra cấu hình
            const languages = this.i18nService.getSupportedLanguages();
            const options = (this.i18nService as any).options;

            return {
                requestLanguage: lang,
                supportedLanguages: languages,
                translations: {
                    current: test1,
                    vi: test2,
                    en: test3
                },
                options: options,
                headers: request.headers
            };
        } catch (error) {
            return {
                error: error.message,
                stack: error.stack
            };
        }
    }
}