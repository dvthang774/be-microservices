import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, TcpContext, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.connectMicroservice<MicroserviceOptions>({
    transport:Transport.TCP,
    options:{
      port:4000
    }
  })
  // await app.listen(3000);
  await app.startAllMicroservices();
}
bootstrap();
