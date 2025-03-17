import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generateUUID } from '../utils/uuid.util';

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    id: true
})
export class BaseSchema extends Document {
    @Prop({
        type: String,
        default: generateUUID,
    })
    _id: string;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({ type: Date, default: null })
    deletedAt: Date;
}