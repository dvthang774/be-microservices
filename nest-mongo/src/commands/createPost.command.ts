import { CreatePostDto } from "src/dto/posts.dto";
import { User } from "src/models/users.model";

export class CreatePostsCommand{
    constructor (
        public readonly user: User,
        public readonly createPostDto: CreatePostDto
    ){}
}