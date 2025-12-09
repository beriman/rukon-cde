import {
    Controller,
    Post,
    Get,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

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
}
