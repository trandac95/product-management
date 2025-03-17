import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/base/base.repository';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {
        super(userModel);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ email });
    }

    async findByIds(ids: string[]): Promise<User[]> {
        return this.find({ _id: { $in: ids } });
    }
}