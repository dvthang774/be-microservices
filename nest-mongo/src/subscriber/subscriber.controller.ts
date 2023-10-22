import {
    Controller,
    Get,
    Inject,
    OnModuleInit,
    Post,
    Req,
        UseGuards,
    } from '@nestjs/common';
    import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
    import { AuthGuard } from '@nestjs/passport';
    // import SubscriberInterface from './subscriber.interface';
    
    @Controller('subscriber')
    export class SubscriberController {
    constructor(
    @Inject('SUBSCRIBER_SERVICE')
    private readonly subscriberService: ClientProxy,
    ){}
    
    // @Get()
    // @UseGuards(AuthGuard('jwt'))
    // async getSubscribers() {
    //     return this.subscriberService.send<>(
    //     {
    //         cmd: 'get-all-subscriber',
    //     },
    //     {},
    //     )
    // }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createSubscriberTCP(@Req() req: any) {
        console.log(req.user)
        return await this.subscriberService.send(
            {
            cmd: 'add-subscriber',
            },
            req.user,
        );
        }

    // @Post('event')
    // @UseGuards(AuthGuard('jwt'))
    // async createSubscriberEvent(@Req() req: any) {
    //     this.subscriberService.emit(
    //     {
    //         cmd: 'add-subscriber',
    //     },
    //     req.user,
    //     );
    //     return true;
    // }
}