import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/services/user.service';
import { CreateUserDto } from '../../modules/user/dtos/create-user.dto';
@Injectable()
export class MigrationUserSeed {
    constructor(private readonly userService: UserService) { }

    @Command({
        command: 'seed:user',
        describe: 'seeds users',
    })
    async seeds(): Promise<void> {
        try {
            const data: CreateUserDto = {
                fullName: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
            };

            await this.userService.create(data);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:user',
        describe: 'remove users',
    })
    async remove(): Promise<void> {
        try {
            await this.userService.deleteMany({});
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
