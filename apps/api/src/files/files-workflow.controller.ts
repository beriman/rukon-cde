import { Controller, Post, Param, UseGuards, Request, ForbiddenException, BadRequestException } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { AuditService } from '../common/services/audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction } from '@prisma/client';

@Controller('projects/:projectId/files')
@UseGuards(JwtAuthGuard)
export class FilesWorkflowController {
    constructor(
        private filesService: FilesService,
        private auditService: AuditService,
        private prisma: PrismaService,
    ) { }

    private async checkPermission(userId: string, projectId: string, allowedRoles: string[]) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { organizationId: true }
        });
        if (!project) throw new ForbiddenException('Project not found');

        const orgUser = await this.prisma.organizationUser.findUnique({
            where: {
                userId_organizationId: { userId, organizationId: project.organizationId }
            }
        });

        // Asumsi: Role menggunakan enum OrgRole (OWNER, ADMIN, MEMBER)
        if (!orgUser || !allowedRoles.includes(orgUser.role)) {
            throw new ForbiddenException('Akses ditolak: Peran Anda tidak mengizinkan aksi ini.');
        }
    }

    @Post(':fileId/promote')
    async promoteToShared(@Request() req, @Param('projectId') projectId: string, @Param('fileId') fileId: string) {
        // Hanya Admin/Owner yang boleh promote ke SHARED
        await this.checkPermission(req.user.id, projectId, ['OWNER', 'ADMIN']);

        const file = await this.filesService.findOne(fileId);
        if (file.cdeState !== 'WIP') {
            throw new BadRequestException(`File harus berstatus WIP. Status saat ini: ${file.cdeState}`);
        }

        const updatedFile = await this.prisma.file.update({
            where: { id: fileId },
            data: {
                cdeState: 'SHARED',
                versions: {
                    update: {
                        where: { fileId_version: { fileId, version: file.currentVersion } },
                        data: { cdeState: 'SHARED' }
                    }
                }
            },
        });

        await this.auditService.log(req.user.id, AuditAction.FILE_PROMOTE, fileId, 'FILE', { projectId, from: 'WIP', to: 'SHARED' });
        return { message: 'File promoted to SHARED', data: updatedFile };
    }

    @Post(':fileId/publish')
    async publish(@Request() req, @Param('projectId') projectId: string, @Param('fileId') fileId: string) {
        // Hanya Owner yang boleh PUBLISH
        await this.checkPermission(req.user.id, projectId, ['OWNER']);

        const file = await this.filesService.findOne(fileId);
        if (file.cdeState !== 'SHARED') {
            throw new BadRequestException('File harus SHARED sebelum bisa PUBLISHED.');
        }

        const updatedFile = await this.prisma.file.update({
            where: { id: fileId },
            data: {
                cdeState: 'PUBLISHED',
                versions: {
                    update: {
                        where: { fileId_version: { fileId, version: file.currentVersion } },
                        data: { cdeState: 'PUBLISHED', revisionCode: 'C01' }
                    }
                }
            },
        });

        await this.auditService.log(req.user.id, AuditAction.FILE_PUBLISH, fileId, 'FILE', { projectId, version: file.currentVersion });
        return { message: 'File PUBLISHED', data: updatedFile };
    }
}
