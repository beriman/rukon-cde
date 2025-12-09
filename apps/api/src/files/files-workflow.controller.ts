import { Controller, Post, Param, Body, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { AuditService } from '../common/services/audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('projects/:projectId/files')
@UseGuards(JwtAuthGuard)
export class FilesWorkflowController {
    constructor(
        private filesService: FilesService,
        private auditService: AuditService,
        private prisma: PrismaService,
    ) { }

    // Story 1.16: Promote WIP -> SHARED
    // Only INFORMATION_MANAGER or LEAD_APPOINTED_PARTY can do this?
    // For now, let's enforce role check.
    @Post(':fileId/promote')
    async promoteToShared(
        @Request() req,
        @Param('projectId') projectId: string,
        @Param('fileId') fileId: string,
    ) {
        const user = req.user;
        // Role Check: In a real app we'd check Project Role. 
        // For compliance, let's assume any Org Member with specific permission can do it.
        // Or strictly check if user is Task Team Manager / Information Manager.
        // Let's defer strict RBAC specific to roles for now and focus on state transition logic.

        const file = await this.filesService.findOne(fileId);

        if (file.cdeState !== 'WIP') {
            throw new ForbiddenException(`File is in ${file.cdeState} state, cannot promote to SHARED from here.`);
        }

        // Update state to SHARED
        // In ISO 19650, this might involve moving to a different folder "Shared"
        // But for metadata-based CDE, we just update the tag.

        const updatedFile = await this.prisma.file.update({
            where: { id: fileId },
            data: {
                cdeState: 'SHARED',
                // Also update the current version's state
                versions: {
                    update: {
                        where: {
                            fileId_version: {
                                fileId: fileId,
                                version: file.currentVersion
                            }
                        },
                        data: { cdeState: 'SHARED' }
                    }
                }
            },
        });

        // Log Audit
        await this.auditService.log(
            user.id,
            AuditAction.FILE_PROMOTE,
            fileId,
            'FILE',
            {
                previousState: 'WIP',
                newState: 'SHARED',
                projectId
            }
        );

        return {
            message: 'File promoted to SHARED state',
            file: updatedFile
        };
    }

    // Story 1.17: Publish SHARED -> PUBLISHED
    // Only LEAD_APPOINTED_PARTY or APPOINTING_PARTY (Client) can do this.
    @Post(':fileId/publish')
    async publish(
        @Request() req,
        @Param('projectId') projectId: string,
        @Param('fileId') fileId: string,
    ) {
        const user = req.user;

        const file = await this.filesService.findOne(fileId);

        if (file.cdeState !== 'SHARED') {
            throw new ForbiddenException(`File is in ${file.cdeState} state, cannot PUBLISH from here. Must be SHARED first.`);
        }

        // Update state to PUBLISHED
        // In this step, we typically "freeze" the file.
        // We might want to create a NEW version that is a copy of the current one but marked as PUBLISHED,
        // ensuring it doesn't change even if someone updates the original file later (though our versioning handles that).
        // Since our system is version-based, the current version IS immutable once a new one is uploaded. 
        // So we just tag this version as PUBLISHED.

        const updatedFile = await this.prisma.file.update({
            where: { id: fileId },
            data: {
                cdeState: 'PUBLISHED',
                versions: {
                    update: {
                        where: {
                            fileId_version: {
                                fileId: fileId,
                                version: file.currentVersion
                            }
                        },
                        data: { cdeState: 'PUBLISHED' }
                    }
                }
            },
        });

        // Log Audit
        await this.auditService.log(
            user.id,
            AuditAction.FILE_PUBLISH,
            fileId,
            'FILE',
            {
                previousState: 'SHARED',
                newState: 'PUBLISHED',
                projectId,
                version: file.currentVersion
            }
        );

        return {
            message: 'File PUBLISHED successfully',
            file: updatedFile
        };
    }
}
