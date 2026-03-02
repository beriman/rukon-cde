import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Request,
    Body,
    BadRequestException,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly reviewsService: ReviewsService,
    ) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
        }),
    )
    upload(
        @Request() req,
        @UploadedFile() file: any,
        @Body('folderId') folderId: string,
    ) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        if (!folderId) {
            throw new BadRequestException('folderId is required');
        }

        return this.filesService.upload(folderId, file, req.user.userId);
    }

    @Get('folder/:folderId')
    findByFolder(@Param('folderId') folderId: string) {
        return this.filesService.findByFolder(folderId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(id);
    }

    @Get(':id/download')
    getDownloadUrl(
        @Param('id') id: string,
        @Query('version') version?: string,
    ) {
        const versionNum = version ? parseInt(version, 10) : undefined;
        return this.filesService.generateDownloadUrl(id, versionNum);
    }

    @Get(':id/versions')
    getVersions(@Param('id') id: string) {
        return this.filesService.getVersions(id);
    }

    @Post(':id/review/initiate')
    async initiateReview(
        @Param('id') id: string,
        @Body('workflowId') workflowId: string,
        @Request() req,
    ) {
        return this.reviewsService.initiateReview(id, workflowId, req.user.userId);
    }

    @Post('reviews/:submittalId/process')
    async processReviewStep(
        @Param('submittalId') submittalId: string,
        @Body('status') status: 'APPROVED' | 'REJECTED' | 'APPROVED_WITH_NOTES',
        @Body('comments') comments: string,
        @Request() req,
    ) {
        return this.reviewsService.processReviewStep(submittalId, req.user.userId, status, comments);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.filesService.archive(id, req.user.userId);
    }
}
