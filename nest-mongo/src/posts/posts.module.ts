import { CacheModule, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/models/posts.model';
import { PostRepository } from 'src/repositories/posts.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategorySchema } from 'src/models/category.model';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from 'src/users/users.module';
import { CreatePostHandler } from 'src/handlers/createPost.handler';
import { GetPostHandler } from 'src/handlers/getPost.handler';
import * as redisStore from 'cache-manager-redis-store';
import { Constants } from 'src/constant/constant';

@Module({
  imports:[MongooseModule.forFeature([
              {
                name: 'Post',
                schema: PostSchema
              },
              {
                name: 'Category',
                schema: CategorySchema
              }
            ]),
            UsersModule,
          CqrsModule,
          CacheModule.registerAsync({
            useFactory:() => ({
              isGlobal: true,
              store: redisStore,
              host: Constants.redis_host,
              port: Constants.redis_port,
              // username: Constants.redis_username,
              // password: Constants.redis_password

            })
          })
],
  controllers: [PostsController, CategoryController],
  providers:[PostsService, PostRepository, CategoryRepository, CategoryService, CreatePostHandler, GetPostHandler]
})
export class PostsModule {}
