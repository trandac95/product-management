import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../common/base/base.schema';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends BaseSchema {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    hashPassword: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop({ type: Boolean, default: false })
    isEmailVerified: boolean;

    @Prop({ type: Date, default: null })
    lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);