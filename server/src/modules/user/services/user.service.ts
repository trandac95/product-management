import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/base/base.service';
import { User } from '../schemas/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { DeleteResult } from 'mongoose';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { BadRequestException } from '../../../common/exceptions/bad-request.exception';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(private readonly userRepository: UserRepository) {
        super(userRepository);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const existingUser = await this.userRepository.findByEmail(createUserDto.email);
            if (existingUser) {
                throw new BadRequestException('user.ERROR.EMAIL_EXISTS');
            }

            return super.create({
                ...createUserDto,
                hashPassword: createUserDto.password,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('user.ERROR.CREATE_FAILED');
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findById(id);
            if (!user) {
                throw new NotFoundException('user.ERROR.NOT_FOUND');
            }

            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
                if (existingUser) {
                    throw new BadRequestException('user.ERROR.EMAIL_EXISTS');
                }
            }

            // Nếu có cập nhật mật khẩu
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            return super.update(id, updateUserDto);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('user.ERROR.UPDATE_FAILED');
        }
    }

    async deleteMany(query: any): Promise<DeleteResult> {
        return this.userRepository.deleteMany(query);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }
}