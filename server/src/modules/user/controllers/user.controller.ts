import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Delete
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../schemas/user.schema';
import { UserService } from '../services/user.service';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UserController {
    constructor(private readonly userService: UserService, private readonly i18nService: I18nService) { }

    @Get('profile')
    @Auth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'Return user profile',
        schema: {
            example: {
                success: true,
                message: 'Profile retrieved successfully',
                data: {
                    id: '123',
                    email: 'user@example.com',
                    name: 'John Doe',
                    createdAt: '2024-03-16T13:27:47.000Z'
                }
            }
        }
    })
    async getProfile(
        @CurrentUser() user: User
    ) {
        return {
            message: this.i18nService.translate('user.SUCCESS.PROFILE_RETRIEVED'),
            data: user
        };
    }

    @Get(':id')
    @Auth()
    @ApiOperation({ summary: 'Get user by ID' })
    async findOne(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Put(':id')
    @Auth()
    @ApiOperation({ summary: 'Update user' })
    @ApiParam({
        name: 'id',
        description: 'User ID'
    })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully'
    })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @I18n() i18n: I18nContext
    ) {
        const user = await this.userService.update(id, updateUserDto);
        return {
            message: this.i18nService.translate('user.SUCCESS.UPDATED'),
            data: user
        };
    }

    @Delete(':id')
    @Auth()
    @ApiOperation({ summary: 'Delete user' })
    @ApiParam({
        name: 'id',
        description: 'User ID'
    })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully'
    })
    async remove(@Param('id') id: string) {
        await this.userService.delete(id);
        return {
            message: this.i18nService.translate('user.SUCCESS.DELETED'),
        };
    }
}