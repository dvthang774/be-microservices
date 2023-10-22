import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberModule } from './subscriber/subscriber.module';

 
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest-email-subscription',
  {
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true
  }), SubscriberModule,
    MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
