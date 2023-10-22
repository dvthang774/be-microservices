import { ICommandHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostQuery } from "src/queries/getPost.query";
import { PostRepository } from "src/repositories/posts.repository";

@QueryHandler(GetPostQuery)
export class GetPostHandler implements ICommandHandler<GetPostQuery>{
    constructor(private postRepository: PostRepository){}

    async execute(command: GetPostQuery){
        console.log("handler")
        return await this.postRepository.findById(command.post_id)
    }
}