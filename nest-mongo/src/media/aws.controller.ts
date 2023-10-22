import {
    Post,
    UseInterceptors,
    UploadedFile,
    Controller,
    UploadedFiles,
    Get,
    Body,
    Query,
    Put,
    Delete,
    } from '@nestjs/common';
    import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AWSService } from './aws.service';
    
    @Controller('media')
    export class AWSController {
        constructor(private readonly awsService: AWSService) {}
        
        @Post('upload')
        @UseInterceptors(FileInterceptor('file'))
        async upload(@UploadedFile() file) {
        return await this.awsService.uploadFile(file);
        }
        @Delete('delete')
        async delete(@Query('media_id') media_id: string) {
        await this.awsService.deleteFile(media_id);
        return true;
        }
    }