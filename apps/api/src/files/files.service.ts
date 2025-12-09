import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class FilesService {
    constructor(
        private prisma: PrismaService,
        private namingService: NamingConventionService,
        private auditService: AuditService,
    ) { }

    async upload(
        folderId: string,
        file: any,
        uploadedBy: string,
    ) {
        // Story 1.14: Validate ISO 19650 naming convention
        const validation = this.namingService.validate(file.originalname);

        if (!validation.isValid) {
            throw new BadRequestException({
                message: 'Invalid file naming convention',
                error: validation.error,
                expected: validation.expected,
                example: validation.example,
                yourFilename: file.originalname,
            });
        }

        const uniqueId = validation.uniqueId;

        // Verify folder exists
        const folder = await this.prisma.folder.findUnique({
            where: { id: folderId },
            include: { project: true },
        });

        if (!folder) {
            throw new BadRequestException('Folder not found');
        }

        const organizationId = folder.project.organizationId;
        const projectId = folder.projectId;

        // Story 1.19: Check if file with same uniqueId exists (auto-versioning)
        const existingFile = await this.prisma.file.findUnique({
            where: {
                folderId_uniqueId: {
                    folderId,
                    uniqueId,
                },
            },
            include: { versions: true },
        });

        // Use transaction for atomic versioning
        const result = await this.prisma.$transaction(async (tx) => {
            if (existingFile) {
                // File exists - create new version
                const newVersion = existingFile.currentVersion + 1;
                const s3Key = `org-${organizationId}/project-${projectId}/files/${uniqueId}-v${newVersion}`;

                if (process.env.AWS_S3_BUCKET) {
                    // TODO: Upload to S3
                    console.log(`[FILE UPLOAD] Uploading to S3: ${s3Key}`);
                } else {
                    // Local Fallback
                    const fs = require('fs');
                    const path = require('path');
                    const uploadDir = path.join(process.cwd(), 'uploads', `org-${organizationId}`, `project-${projectId}`);

                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const filePath = path.join(uploadDir, `${uniqueId}-v${newVersion}`);
                    fs.writeFileSync(filePath, file.buffer);
                    console.log(`[FILE UPLOAD] Saved locally to: ${filePath}`);
                }

                // Update file record with new current version
                const updatedFile = await tx.file.update({
                    where: { id: existingFile.id },
                    data: {
                        currentVersion: newVersion,
                        name: file.originalname,
                        size: file.size,
                        mimeType: file.mimetype,
                        s3Key,
                        updatedAt: new Date(),
                        versions: {
                            create: {
                                version: newVersion,
                                s3Key,
                                size: file.size,
                                uploadedBy,
                                cdeState: 'WIP',
                            },
                        },
                    },
                    include: {
                        versions: {
                            orderBy: { version: 'desc' },
                            take: 1,
                        },
                    },
                });

                return {
                    id: updatedFile.id,
                    name: updatedFile.name,
                    uniqueId: updatedFile.uniqueId,
                    size: updatedFile.size,
                    mimeType: updatedFile.mimeType,
                    version: newVersion,
                    cdeState: updatedFile.cdeState,
                    createdAt: updatedFile.createdAt,
                    message: `New version (v${newVersion}) created for existing file`,
                };
            } else {
                // New file - create with version 1
                const s3Key = `org-${organizationId}/project-${projectId}/files/${uniqueId}-v1`;

                if (process.env.AWS_S3_BUCKET) {
                    // TODO: Upload to S3
                    console.log(`[FILE UPLOAD] Uploading to S3: ${s3Key}`);
                } else {
                    // Local Fallback
                    const fs = require('fs');
                    const path = require('path');
                    const uploadDir = path.join(process.cwd(), 'uploads', `org-${organizationId}`, `project-${projectId}`);

                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const filePath = path.join(uploadDir, `${uniqueId}-v1`);
                    fs.writeFileSync(filePath, file.buffer);
                    console.log(`[FILE UPLOAD] Saved locally to: ${filePath}`);
                }

                const newFile = await tx.file.create({
                    data: {
                        name: file.originalname,
                        originalName: file.originalname,
                        uniqueId,
                        s3Key,
                        size: file.size,
                        mimeType: file.mimetype,
                        folderId,
                        uploadedBy,
                        version: 1,
                        currentVersion: 1,
                        cdeState: 'WIP',
                        versions: {
                            create: {
                                version: 1,
                                s3Key,
                                size: file.size,
                                uploadedBy,
                                cdeState: 'WIP',
                            },
                        },
                    },
                });

                return {
                    id: newFile.id,
                    name: newFile.name,
                    uniqueId: newFile.uniqueId,
                    size: newFile.size,
                    mimeType: newFile.mimeType,
                    version: 1,
                    cdeState: newFile.cdeState,
                    createdAt: newFile.createdAt,
                    message: 'New file created successfully',
                };
            }
        });

        // Audit Log
        this.auditService.log(
            uploadedBy,
            AuditAction.FILE_UPLOAD,
            result.id,
            'FILE',
            {
                fileName: file.originalname,
                version: result.version,
                size: file.size
            }
        ).catch(err => console.error('Audit log failed', err));

        return result;
    }

    async findByFolder(folderId: string, userId: string) {
        // Verify folder exists and check access
        const folder = await this.prisma.folder.findUnique({
            where: { id: folderId },
            include: { project: true }
        });

        if (!folder) {
            throw new NotFoundException('Folder not found');
        }

        // Get user role and discipline
        const orgUser = await this.prisma.organizationUser.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: folder.project.organizationId,
                },
            },
        });

        if (!orgUser) {
            throw new BadRequestException('User is not a member of this project organization');
        }

        // Check Access
        if (orgUser.role !== 'OWNER' && orgUser.role !== 'ADMIN') {
            if (folder.discipline && folder.discipline !== orgUser.discipline) {
                // If folder is restricted to a discipline different from user's
                throw new BadRequestException(`Access denied. This folder is reserved for ${folder.discipline} discipline.`);
            }
        }

        // Fetch direct files
        const files = await this.prisma.file.findMany({
            where: { folderId },
            orderBy: { createdAt: 'desc' },
            include: {
                linkSource: {
                    select: {
                        id: true,
                        name: true,
                        uniqueId: true,
                        currentVersion: true,
                        updatedAt: true,
                    }
                }
            }
        });

        return files.map(file => {
            if (file.linkSourceId) {
                // This is a link, map to look like a file but with link metadata
                return {
                    id: file.id,
                    name: file.linkSource.name, // Use original name
                    uniqueId: file.linkSource.uniqueId,
                    size: 0, // Links have no size
                    mimeType: 'application/link',
                    currentVersion: file.linkSource.currentVersion,
                    cdeState: 'SHARED', // Links are usually shared content
                    createdAt: file.createdAt,
                    updatedAt: file.linkSource.updatedAt, // Reflect source update
                    isLink: true,
                    linkSourceId: file.linkSourceId
                };
            }
            return {
                id: file.id,
                name: file.name,
                uniqueId: file.uniqueId,
                size: file.size,
                mimeType: file.mimeType,
                currentVersion: file.currentVersion,
                cdeState: file.cdeState,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
                isLink: false
            };
        });
    }

    async createLink(sourceFileId: string, targetFolderId: string, userId: string) {
        const sourceFile = await this.prisma.file.findUnique({ where: { id: sourceFileId } });
        if (!sourceFile) throw new NotFoundException('Source file not found');

        // Verify target folder exists
        const folder = await this.prisma.folder.findUnique({ where: { id: targetFolderId } });
        if (!folder) throw new NotFoundException('Target folder not found');

        // Create the link (A file record with linkSourceId)
        // We use a generated uniqueId for the link itself to avoid collision in DB unique constraints
        const linkUniqueId = `${sourceFile.uniqueId}-LINK-${Date.now()}`;

        const link = await this.prisma.file.create({
            data: {
                name: sourceFile.name,
                originalName: sourceFile.originalName,
                uniqueId: linkUniqueId, // Internal ID
                s3Key: 'LINK', // Placeholder
                size: 0,
                mimeType: 'application/link',
                folderId: targetFolderId,
                uploadedBy: userId,
                version: 1,
                currentVersion: 1,
                cdeState: 'SHARED',
                linkSourceId: sourceFile.id
            }
        });

        return link;
    }

    async findOne(id: string) {
        const file = await this.prisma.file.findUnique({
            where: { id },
            include: {
                folder: {
                    include: {
                        project: true,
                    },
                },
                versions: {
                    orderBy: { version: 'desc' },
                },
            },
        });

        if (!file) {
            throw new NotFoundException('File not found');
        }

        return file;
    }

    // Story 1.19: Get all versions of a file
    async getVersions(id: string) {
        const file = await this.findOne(id);

        return {
            fileId: file.id,
            fileName: file.name,
            uniqueId: file.uniqueId,
            currentVersion: file.currentVersion,
            versions: file.versions.map(v => ({
                version: v.version,
                uploadedBy: v.uploadedBy,
                uploadedAt: v.createdAt,
                cdeState: v.cdeState,
                size: v.size,
                isCurrent: v.version === file.currentVersion,
            })),
        };
    }

    // Story 1.15: Generate presigned download URL
    async generateDownloadUrl(id: string, version?: number) {
        const file = await this.findOne(id);

        // Find target version
        const targetVersion = version
            ? file.versions.find(v => v.version === version)
            : file.versions.find(v => v.version === file.currentVersion);

        if (!targetVersion) {
            throw new NotFoundException(`Version ${version || file.currentVersion} not found`);
        }

        const stubUrl = `https://s3.amazonaws.com/${process.env.AWS_S3_BUCKET || 'rukon-cde'}/${targetVersion.s3Key}`;
        console.log(`[DOWNLOAD STUB] Would generate presigned URL for: ${targetVersion.s3Key}`);
        console.log(`Version: ${targetVersion.version}, File: ${file.name}`);

        // Audit Log
        // Note: Assuming we have context for user who is downloading. 
        // Since we don't have request context here, we skip logging or would need to refactor to pass user.
        // For now, we will skip logging DOWNLOAD in service to avoid breaking API signature too much, 
        // or we adding it if easy.

        return {
            url: stubUrl,
            filename: file.name,
            version: targetVersion.version,
            size: targetVersion.size,
            expiresIn: 300, // 5 minutes
        };
    }
}
