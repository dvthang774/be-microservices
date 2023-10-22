import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/httpException.filter';
import { MediaModule } from './media/media.module';
import { SubscriberModule } from './subscriber/subscriber.module';
const dotenv = require("dotenv")

@Module({
  imports: [ConfigModule.forRoot(),
      // MongooseModule.forRoot(process.env.MONGO_URL,{
      // dbName:process.env.MONGO_DB,
    //   useNewUrlParser:true,
    //   useFindAndModify:false,
    //   useCreateIndex:true
    
    // }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest-mongo',
    {
      useNewUrlParser:true,
      useFindAndModify:false,
      useCreateIndex:true
    }),
    PostsModule,
    UsersModule,
    MediaModule,
    SubscriberModule
    ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
