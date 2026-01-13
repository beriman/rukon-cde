import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface QrLookupResult {
    type: 'asset' | 'room';
    id: string;
    name: string;
    code?: string;
    description?: string;
    projectId: string;
    projectName: string;
    relatedFiles?: Array<{
        id: string;
        name: string;
        fileType: string;
    }>;
    metadata?: Record<string, any>;
}

@Injectable()
export class QrService {
    private readonly QR_PREFIX = 'rukon://';

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Parse QR code and lookup the resource
     * Format: rukon://asset/{assetId} or rukon://room/{roomId}
     */
    async lookup(code: string): Promise<QrLookupResult | null> {
        const parsed = this.parseQrCode(code);

        if (!parsed) {
            return null;
        }

        const { type, id } = parsed;

        if (type === 'asset') {
            return this.lookupAsset(id);
        } else if (type === 'room') {
            return this.lookupRoom(id);
        }

        return null;
    }

    /**
     * Parse QR code string into type and id
     */
    private parseQrCode(code: string): { type: 'asset' | 'room'; id: string } | null {
        if (!code.startsWith(this.QR_PREFIX)) {
            return null;
        }

        const path = code.substring(this.QR_PREFIX.length);
        const [type, id] = path.split('/');

        if (!type || !id) {
            return null;
        }

        if (type !== 'asset' && type !== 'room') {
            return null;
        }

        return { type, id };
    }

    /**
     * Lookup asset (procurement item) by ID
     */
    private async lookupAsset(id: string): Promise<QrLookupResult | null> {
        try {
            const asset = await this.prisma.procurementItem.findUnique({
                where: { id },
                include: {
                    project: { select: { id: true, name: true } },
                },
            });

            if (!asset) {
                return null;
            }

            return {
                type: 'asset',
                id: asset.id,
                name: asset.name,
                code: asset.category,  // Using category as code since 'code' field doesn't exist
                projectId: asset.project.id,
                projectName: asset.project.name,
                metadata: {
                    quantity: asset.quantity,
                    unit: asset.unit,
                    status: asset.status,
                    supplier: asset.supplier,
                },
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Lookup room by ID
     * Note: Using Folder as Room proxy since no dedicated Room model exists
     */
    private async lookupRoom(id: string): Promise<QrLookupResult | null> {
        try {
            // Using Folder as room representation
            const room = await this.prisma.folder.findUnique({
                where: { id },
                include: {
                    project: { select: { id: true, name: true } },
                    files: {
                        take: 10,
                        select: { id: true, name: true, mimeType: true },
                    },
                },
            });

            if (!room) {
                return null;
            }

            return {
                type: 'room',
                id: room.id,
                name: room.name,
                projectId: room.project.id,
                projectName: room.project.name,
                relatedFiles: room.files.map((f) => ({
                    id: f.id,
                    name: f.name,
                    fileType: f.mimeType,
                })),
                metadata: {
                    discipline: room.discipline,
                    isSystem: room.isSystem,
                },
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Generate QR code data string
     */
    generateQrData(type: 'asset' | 'room', id: string): { qrCode: string; displayUrl: string } {
        const qrCode = `${this.QR_PREFIX}${type}/${id}`;
        const displayUrl = `/app/${type}s/${id}`;

        return { qrCode, displayUrl };
    }

    /**
     * Validate if a QR code is valid Rukon format
     */
    isValidQrCode(code: string): boolean {
        return this.parseQrCode(code) !== null;
    }
}
