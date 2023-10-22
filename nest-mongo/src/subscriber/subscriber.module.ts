import { Module } from '@nestjs/common';
import { Client, ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriberController } from './subscriber.controller';

@Module({
    imports:[ClientsModule.register([
        {name: 'SUBSCRIBER_SERVICE',transport: Transport.TCP,
        options : {
            host: 'localhost',
            port: 4000
            }
        }
        ])],
    controllers:[SubscriberController],
    providers:[
        // {
        //     provide:"SUBSCRIBER_SERVICE",
        //     useFactory:()=>{
        //         ClientProxyFactory.create({
        //             transport: Transport.TCP,
        //             options:{
        //                 host:'localhost',
        //                 port:4000
        //             }
        //         })
        //     }
        // }
    ]
})
export class SubscriberModule {}
