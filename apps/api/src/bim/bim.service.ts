import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BimService {
    constructor(
        private filesService: FilesService,
        private prisma: PrismaService,
    ) { }

    async getAccessToken(projectId: string, fileId: string, userId: string): Promise<{ token: string; url: string; expires: number }> {
        // 1. Verify file exists
        const file = await this.filesService.findOne(fileId);

        // 2. Verify file belongs to project
        // Note: FilesService.findOne includes folder.project, so we can check deep relation
        const folder = await this.prisma.folder.findUnique({
            where: { id: file.folderId },
            select: { projectId: true },
        });

        if (!folder || folder.projectId !== projectId) {
            throw new NotFoundException('File not found in this project');
        }

        // 3. Generate Download URL
        // For MVP we just use the raw filesService URL. 
        // In future, this "token" might be a specialized short-lived 3D viewer token.
        const download = await this.filesService.generateDownloadUrl(fileId);

        return {
            token: 'mock-viewer-token', // Placeholder for viewer-specific auth
            url: download.url, // Presigned URL
            expires: download.expiresIn,
        };
    }
}
