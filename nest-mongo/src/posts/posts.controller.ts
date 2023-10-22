import { Body,
        CACHE_MANAGER,
        CacheInterceptor, 
        CacheKey, 
        Controller, 
        Delete, 
        Get, 
        Inject, 
        Param, 
        Post, 
        Put, 
        Query, 
        Req, 
        UseFilters, 
        UseGuards, 
        UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, PaginationPostDto, UpdatePostDto } from 'src/dto/posts.dto';
import { HttpExceptionFilter } from 'src/utils/httpException.filter';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostsCommand } from 'src/commands/createPost.command';
import { GetPostQuery } from 'src/queries/getPost.query';
import { Cache } from 'cache-manager';


@Controller('posts')
export class PostsController {
    constructor(private readonly postService:PostsService,
                private readonly commandBus: CommandBus,
                private readonly queryBus:QueryBus,
                @Inject(CACHE_MANAGER) private cacheManager: Cache)
{}
    @Get()
    getAllPost(@Query() { page, limit, start }: PaginationPostDto) {
        return this.postService.getAllPosts(page, limit, start);
    }

    
    @Get(':id')
    @UseFilters(HttpExceptionFilter)
    getPostById(@Param('id') id: string) {
        return this.postService.getPostById(id);
    } 

    @Get(':id/get-in-cache')
    @UseInterceptors(CacheInterceptor)
    getPostWithCache(@Param('id') id: string) {
        console.log('Cache')
        return this.postService.getPostById(id);
    }

    @Get('cache/set-cache')
    async setCache(){
        return await this.cacheManager.set("key","value")
        // return true;
    }

    @CacheKey('custom-key')
    @Get('cache/get-cache')
    // @UseInterceptors(CacheInterceptor)
    async getCache(){
        console.log("key")
        await this.cacheManager.get("key")
    }

    @Get(':id/by-query')
    async getByQuery(@Param('id') id: string) {
        console.log("controller")
        return await this.queryBus.execute(new GetPostQuery(id));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user/all')
    async getPostUser(@Req() req: any) {
        await req.user
            .populate({
            path: 'posts',
            // select: 'title',
            })
            .execPopulate();
        return req.user.posts;
        }

    @Get('get/category')
    async getByCategory(@Query('category_id') category_id) {
        return await this.postService.getByCategory(category_id);
    }

    @Get('get/categories')
    async getByCategories(@Query('category_ids') category_ids) {
        return await this.postService.getByCategories(category_ids);
        }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createPost(@Req() req: any, @Body() post: CreatePostDto) {
        return this.postService.createPost(req.user, post);   
    }

    @Post('create-by-command')
    @UseGuards(AuthGuard('jwt'))
    async createByCommand(@Req() req: any, @Body() post: CreatePostDto) {
        console.log("reuest in Ctroller")
        return  await this.commandBus.execute(new CreatePostsCommand(req.user, post));
    }
    
    @Put(':id')
    async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
        return this.postService.replacePost(id, post);
    }
    
    @Delete(':id')
    remove(@Param('id') id: string) {
        return `This action removes a #${id} cat`;
    }
}


