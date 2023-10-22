import { CommandHandler, ICommandBus, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostsCommand } from "src/commands/createPost.command";
import { CreatePostDto } from "src/dto/posts.dto";
import { PostRepository } from "src/repositories/posts.repository";

@CommandHandler(CreatePostsCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostsCommand>{
    constructor(
        private postRepository: PostRepository
    )
    {}

    async execute(command: CreatePostsCommand ){
        console.log("handler")
        command.createPostDto.user = command.user._id;
        return await this.postRepository.create(command.createPostDto);

    }
}