import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import path from 'path';
import { CreatePostDto, UpdatePostDto } from 'src/dto/posts.dto';
import { User } from 'src/models/users.model';
import { CategoryRepository } from 'src/repositories/category.repository';
import { PostRepository } from 'src/repositories/posts.repository';

@Injectable()
export class PostsService {
    constructor(private readonly postRepository : PostRepository,
                private readonly categoryRepository : CategoryRepository
        ){}

    
    async getAllPosts(page: number, limit: number, start: string) {
        const count = await this.postRepository.countDocuments({});
        const count_page = (count / limit).toFixed();
        const posts = await this.postRepository.getByCondition(
        {
            _id: {
            $gt: isValidObjectId(start) ? start : '000000000000000000000000',
            },
        },
        null,
        {
            sort: {
            _id: 1,
            },
            skip: (page - 1) * limit,
            limit: Number(limit),
        },
        );
        return { count_page, posts };
    }


    async getPostById(post_id:string){
        const post = await this.postRepository.findById(post_id);
        if(post){
            return post.populate({path: 'user', select: "email name"}).execPopulate();
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    }


    async getByCategory(category_id: string) {
        return await this.postRepository.getByCondition({
        categories: {
            $elemMatch: { $eq: category_id },
        },
        });
    }

    async getByCategories(category_ids: [string]) {
        return await this.postRepository.getByCondition({
        categories: {
            $all: category_ids,
        },
        });
    }


    async createPost(user: User, post: CreatePostDto) {
        post.user = user._id;
        const new_post = await this.postRepository.create(post);
        if (post.categories) {
            await this.categoryRepository.updateMany(
                {
                _id: { $in: post.categories },
                },
                {
                $push: {
                    posts: new_post._id,
                },
                },
            );
            }
            return new_post;
        }
    
    async replacePost(post_id: string, data: UpdatePostDto) {
        return await this.postRepository.findByIdAndUpdate(post_id, data);
    }
}
