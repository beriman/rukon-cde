import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteCaptureDto, UpdateSiteCaptureDto, QuerySiteCaptureDto } from './site-capture.dto';
import { CaptureType } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class SiteCaptureService {
    private s3Client: S3Client;
    private bucket: string;

    constructor(private readonly prisma: PrismaService) {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'ap-southeast-1',
        });
        this.bucket = process.env.S3_BUCKET || 'rukon-uploads';
    }

    async create(dto: CreateSiteCaptureDto, file: any, userId: string) {
        // Prevent path traversal by extracting only the filename and replacing unsafe characters
        const safeOriginalName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_');

        // Upload file to S3
        const fileKey = `site-captures/${dto.projectId}/${uuidv4()}-${safeOriginalName}`;

        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        // Generate thumbnail for photos (placeholder - would use image processing)
        let thumbnailUrl = null;
        if (dto.captureType === 'PHOTO') {
            thumbnailUrl = fileKey; // In production, would generate actual thumbnail
        }

        return this.prisma.siteCapture.create({
            data: {
                projectId: dto.projectId,
                drawingId: dto.drawingId,
                capturedBy: userId,
                captureType: dto.captureType as CaptureType,
                fileUrl: fileKey,
                thumbnailUrl,
                latitude: dto.latitude,
                longitude: dto.longitude,
                altitude: dto.altitude,
                gpsAccuracy: dto.gpsAccuracy,
                pinX: dto.pinX,
                pinY: dto.pinY,
                commentary: dto.commentary,
                voiceNoteUrl: dto.voiceNoteUrl,
                voiceNoteDurationSec: dto.voiceNoteDurationSec,
                fileSizeBytes: file.size,
                mimeType: file.mimetype,
                synced: true,
                uploadedAt: new Date(),
                capturedAt: dto.capturedAt ? new Date(dto.capturedAt) : new Date(),
                metadata: dto.metadata,
            },
        });
    }

    async findAll(query: QuerySiteCaptureDto, userId: string) {
        const where: any = {};

        if (query.projectId) {
            where.projectId = query.projectId;
        }

        if (query.drawingId) {
            where.drawingId = query.drawingId;
        }

        if (query.captureType) {
            where.captureType = query.captureType;
        }

        if (query.synced !== undefined) {
            where.synced = query.synced;
        }

        const [items, total] = await Promise.all([
            this.prisma.siteCapture.findMany({
                where,
                orderBy: { capturedAt: 'desc' },
                take: query.limit || 50,
                skip: query.offset || 0,
                include: {
                    project: { select: { name: true, code: true } },
                },
            }),
            this.prisma.siteCapture.count({ where }),
        ]);

        return { items, total, limit: query.limit || 50, offset: query.offset || 0 };
    }

    async findOne(id: string) {
        const capture = await this.prisma.siteCapture.findUnique({
            where: { id },
            include: {
                project: { select: { name: true, code: true } },
            },
        });

        if (!capture) {
            throw new NotFoundException('Site capture not found');
        }

        return capture;
    }

    async update(id: string, dto: UpdateSiteCaptureDto, userId: string) {
        await this.findOne(id);

        return this.prisma.siteCapture.update({
            where: { id },
            data: {
                commentary: dto.commentary,
                pinX: dto.pinX,
                pinY: dto.pinY,
                drawingId: dto.drawingId,
                metadata: dto.metadata,
            },
        });
    }

    async delete(id: string, userId: string) {
        const capture = await this.findOne(id);

        // Delete file from S3
        try {
            const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
            await this.s3Client.send(new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: capture.fileUrl,
            }));
            console.log(`[SITE CAPTURE] Deleted from S3: ${capture.fileUrl}`);

            // Also delete thumbnail if exists
            if (capture.thumbnailUrl && capture.thumbnailUrl !== capture.fileUrl) {
                await this.s3Client.send(new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: capture.thumbnailUrl,
                }));
            }
        } catch (error) {
            console.error('[SITE CAPTURE] Failed to delete from S3:', error);
            // Continue with database deletion even if S3 fails
        }

        return this.prisma.siteCapture.delete({
            where: { id },
        });
    }

    async createBatch(captures: CreateSiteCaptureDto[], userId: string) {
        // For batch creation from mobile sync
        // Files should already be uploaded, just create records
        const results = await Promise.all(
            captures.map(async (dto) => {
                try {
                    return await this.prisma.siteCapture.create({
                        data: {
                            projectId: dto.projectId,
                            drawingId: dto.drawingId,
                            capturedBy: userId,
                            captureType: dto.captureType as CaptureType,
                            fileUrl: dto.fileUrl || '',
                            thumbnailUrl: dto.thumbnailUrl,
                            latitude: dto.latitude,
                            longitude: dto.longitude,
                            altitude: dto.altitude,
                            gpsAccuracy: dto.gpsAccuracy,
                            pinX: dto.pinX,
                            pinY: dto.pinY,
                            commentary: dto.commentary,
                            voiceNoteUrl: dto.voiceNoteUrl,
                            voiceNoteDurationSec: dto.voiceNoteDurationSec,
                            fileSizeBytes: dto.fileSizeBytes || 0,
                            mimeType: dto.mimeType,
                            synced: true,
                            uploadedAt: new Date(),
                            capturedAt: dto.capturedAt ? new Date(dto.capturedAt) : new Date(),
                            metadata: dto.metadata,
                        },
                    });
                } catch (error) {
                    return { error: error.message, dto };
                }
            }),
        );

        return {
            total: captures.length,
            succeeded: results.filter((r) => !('error' in r)).length,
            failed: results.filter((r) => 'error' in r),
        };
    }

    async getProjectStats(projectId: string) {
        const [total, photos, videos, voiceNotes, unsynced] = await Promise.all([
            this.prisma.siteCapture.count({ where: { projectId } }),
            this.prisma.siteCapture.count({ where: { projectId, captureType: 'PHOTO' } }),
            this.prisma.siteCapture.count({ where: { projectId, captureType: 'VIDEO' } }),
            this.prisma.siteCapture.count({ where: { projectId, captureType: 'VOICE_NOTE' } }),
            this.prisma.siteCapture.count({ where: { projectId, synced: false } }),
        ]);

        return { total, photos, videos, voiceNotes, unsynced };
    }

    async getDrawingPins(drawingId: string) {
        return this.prisma.siteCapture.findMany({
            where: { drawingId, pinX: { not: null }, pinY: { not: null } },
            select: {
                id: true,
                captureType: true,
                thumbnailUrl: true,
                pinX: true,
                pinY: true,
                commentary: true,
                capturedAt: true,
            },
            orderBy: { capturedAt: 'desc' },
        });
    }
}
