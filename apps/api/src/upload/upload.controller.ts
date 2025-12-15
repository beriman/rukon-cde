import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

class GetPresignedUrlDto {
    fileName: string;
    fileType: string;
}

class GetPresignedUrlsDto {
    files: { fileName: string; fileType: string }[];
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('presigned-url')
    async getPresignedUrl(@Body() dto: GetPresignedUrlDto) {
        return this.uploadService.getPresignedUploadUrl(dto.fileName, dto.fileType);
    }

    @Post('presigned-urls')
    async getPresignedUrls(@Body() dto: GetPresignedUrlsDto) {
        return this.uploadService.getPresignedUploadUrls(dto.files);
    }
}
