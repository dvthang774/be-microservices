import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberSchema } from './subscriber.model';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { SubscriberRepository } from './subscriber.repository';

@Module({
    imports:[MongooseModule.forFeature([{
        name: 'Subscriber',
        schema: SubscriberSchema
        },
    ]),
],
    controllers:[SubscriberController],
    providers:[SubscriberService, SubscriberRepository],

})
export class SubscriberModule {}
