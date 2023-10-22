import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaSchema } from 'src/models/media.model';
import { MediaController } from './media.controller';
import { MediaRepository } from 'src/repositories/media.repository';
import { AWSController } from './aws.controller';
import { AWSService } from './aws.service';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name:'Media',
      schema: MediaSchema
    }
  ])],
  controllers:[AWSController],
  providers: [AWSService, MediaRepository]
})
export class MediaModule {}
