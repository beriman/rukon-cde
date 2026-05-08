import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import { AuditAction } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
    private s3Client: S3Client;
    private bucket: string;

    constructor(
        private prisma: PrismaService,
        private namingService: NamingConventionService,
        private auditService: AuditService,
        private conversionService: ConversionService,
    ) {
        // Initialize S3 client
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'ap-southeast-1',
            credentials: process.env.AWS_ACCESS_KEY_ID ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            } : undefined,
        });
        this.bucket = process.env.AWS_S3_BUCKET || 'rukon-cde-uploads';
    }

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

        // WIP FOLDER VALIDATION (Story: Separate WIP per Group/Company)
        // Find if folder is under 01-WIP and check team membership
        const isWip = folder.name === '01-WIP' ||
            (await this.prisma.folder.findFirst({
                where: { id: folder.parentId || '', name: '01-WIP' }
            })) ||
            (folder.parentId && await this.isUnderWip(folder.parentId));

        if (isWip && folder.project.ownerId !== uploadedBy) {
            // Check if this folder or its top-level WIP parent is assigned to user's team
            const teamWithThisWip = await this.prisma.projectTeam.findFirst({
                where: {
                    OR: [
                        { wipFolderId: folderId },
                        { wipFolderId: folder.parentId || '' }
                        // Note: For deep nesting, we'd need a recursive check or path attribute
                    ],
                    members: { some: { id: uploadedBy } }
                }
            });

            // If it's a WIP folder but user not in the team, deny
            // (Unless it's the root 01-WIP itself, which usually users shouldn't upload to directly anyway)
            if (!teamWithThisWip && folder.name !== '01-WIP') {
                throw new BadRequestException('You can only upload to your own team\'s WIP folder.');
            }
        }

        // PERMISSION CHECK (Story: Restricted Folders)
        // @ts-ignore
        if (folder.permissions && folder.permissions['write']) {
            // @ts-ignore
            const allowedRoles = folder.permissions['write'] as string[];
            if (!allowedRoles.includes('*')) {
                // We need to check user's role.
                // Assuming we can get the user's role in the organization.
                // For MVP, checking against Global Role or Invitation Role.
                const user = await this.prisma.user.findUnique({ where: { id: uploadedBy } });

                // Fetch Org Role (via Invitation/Member table)
                // This assumes 'Invitation' acts as member record once used.
                const memberRecord = await this.prisma.invitation.findFirst({
                    where: {
                        organizationId: folder.project.organizationId,
                        email: user?.email,
                        used: true
                    }
                });

                const userRole = memberRecord?.role || 'MEMBER'; // Default to MEMBER

                // Check if allowed
                // e.g. allowedRoles = ['role:ADMIN'], userRole = 'ADMIN' -> Match
                const hasPermission = allowedRoles.some(r => r === `role:${userRole}` || r === `user:${uploadedBy}`);

                if (!hasPermission) {
                    throw new BadRequestException('You do not have permission to upload to this folder (Read Only).');
                }
            }
        }

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
                    // Upload to S3 (version update)
                    await this.s3Client.send(new PutObjectCommand({
                        Bucket: this.bucket,
                        Key: s3Key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                        Metadata: {
                            'original-name': file.originalname,
                            'unique-id': uniqueId,
                            'version': String(newVersion),
                        },
                    }));
                    console.log(`[FILE UPLOAD] Uploaded to S3: ${s3Key}`);
                } else {
                    // Local Fallback
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

                // Trigger Conversion if RVT
                if (file.originalname.toLowerCase().endsWith('.rvt')) {
                    this.conversionService.processFile(updatedFile.id, s3Key).catch(console.error);
                }

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
                    // Upload to S3 (new file)
                    await this.s3Client.send(new PutObjectCommand({
                        Bucket: this.bucket,
                        Key: s3Key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                        Metadata: {
                            'original-name': file.originalname,
                            'unique-id': uniqueId,
                            'version': '1',
                        },
                    }));
                    console.log(`[FILE UPLOAD] Uploaded to S3: ${s3Key}`);
                } else {
                    // Local Fallback
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

                // Trigger Conversion if RVT
                if (file.originalname.toLowerCase().endsWith('.rvt')) {
                    this.conversionService.processFile(newFile.id, s3Key).catch(console.error);
                }

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

    async findByFolder(folderId: string) {
        return this.prisma.file.findMany({
            where: { folderId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                uniqueId: true,
                size: true,
                mimeType: true,
                currentVersion: true,
                cdeState: true,
                createdAt: true,
                updatedAt: true,
            },
        });
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

        return {
            url: stubUrl,
            filename: file.name,
            version: targetVersion.version,
            size: targetVersion.size,
            expiresIn: 300, // 5 minutes
        };
    }

    // Story 1.21: Soft Delete to Cold Storage
    async archive(id: string, userId: string) {
        const file = await this.findOne(id);

        // Check if already archived
        if (file.cdeState === 'ARCHIVED') {
            throw new BadRequestException('File is already archived');
        }

        // 1. Move S3 Object to Cold Storage (Archive Folder + Glacier Class)
        if (process.env.AWS_S3_BUCKET) {
            for (const version of file.versions) {
                const oldKey = version.s3Key;
                const newKey = `archive/${oldKey}`; // Prefix with archive/

                try {
                    // Copy to new location with StorageClass: GLACIER (or DEEP_ARCHIVE)
                    await this.s3Client.send(new CopyObjectCommand({
                        Bucket: this.bucket,
                        CopySource: `${this.bucket}/${oldKey}`,
                        Key: newKey,
                        StorageClass: 'GLACIER',
                        MetadataDirective: 'COPY',
                    }));

                    // Delete original
                    await this.s3Client.send(new DeleteObjectCommand({
                        Bucket: this.bucket,
                        Key: oldKey,
                    }));

                    console.log(`[ARCHIVE] Moved ${oldKey} to ${newKey} (Glacier)`);
                } catch (e) {
                    console.error(`Failed to move ${oldKey} to Glacier`, e);
                }
            }
        }

        // 2. Update DB Status
        const updated = await this.prisma.file.update({
            where: { id },
            data: {
                cdeState: 'ARCHIVED',
                updatedAt: new Date()
            }
        });

        // 3. Audit Log
        await this.auditService.log(
            userId,
            AuditAction.FILE_DELETE,
            id,
            'FILE',
            { message: 'Moved to Cold Storage (Glacier)' }
        ).catch(e => console.error('Audit fail', e));

        return updated;
    }


    // Story: Official Letterhead
    async uploadSystemFile(
        organizationId: string,
        file: any,
        subfolder: string = 'assets'
    ) {
        // Sanitize inputs to prevent path traversal
        const safeOriginalName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const safeSubfolder = subfolder.replace(/\0/g, '').replace(/\\/g, '/').replace(/(^|\/)\.\.(?=\/|$)/g, '').replace(/^\/+/, '');

        const timestamp = Date.now();
        const s3Key = `org-${organizationId}/system/${safeSubfolder}/${timestamp}-${safeOriginalName}`;

        if (process.env.AWS_S3_BUCKET) {
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucket,
                Key: s3Key,
                Body: file.buffer,
                ContentType: file.mimetype,
                // Private by default
            }));
        } else {
            // Local fallback
            const uploadDir = path.join(process.cwd(), 'uploads', `org-${organizationId}`, 'system', safeSubfolder);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, `${timestamp}-${safeOriginalName}`);
            fs.writeFileSync(filePath, file.buffer);
        }

        return { s3Key };
    }

    private async isUnderWip(folderId: string): Promise<boolean> {
        const folder = await this.prisma.folder.findUnique({
            where: { id: folderId },
            select: { name: true, parentId: true }
        });

        if (!folder) return false;
        if (folder.name === '01-WIP') return true;
        if (folder.parentId) return this.isUnderWip(folder.parentId);
        return false;
    }
}
