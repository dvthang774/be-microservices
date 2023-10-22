import { Schema, Document } from 'mongoose';
import { User } from '../models/users.model';
import { Post } from '../models/posts.model';

const CategorySchema = new Schema(
    {
        title: String,
        posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    },
    {
        timestamps: true,
        collection: 'categories',
    },
    );

export { CategorySchema };

export interface Category extends Document {
    title: string;
    posts: [Post];
}