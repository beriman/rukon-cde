import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RedactedElement {
    elementId: string;
    type: '3D' | '2D';
    reason?: string;
}

export interface CreateRedactionDto {
    fileId: string;
    elements: RedactedElement[];
    name: string;
}

@Injectable()
export class RedactionService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a redaction set for a file
     */
    async createRedaction(dto: CreateRedactionDto, userId: string) {
        return this.prisma.redaction.create({
            data: {
                name: dto.name,
                fileId: dto.fileId,
                elements: dto.elements,
                createdById: userId,
                status: 'ACTIVE',
            },
        });
    }

    /**
     * Get redactions for a file
     */
    async getRedactions(fileId: string) {
        return this.prisma.redaction.findMany({
            where: { fileId, status: 'ACTIVE' },
            include: {
                createdBy: { select: { id: true, name: true } },
            },
        });
    }

    /**
     * Apply redaction to export (returns element IDs to hide)
     */
    async getRedactedElements(fileId: string, redactionId?: string): Promise<string[]> {
        const where: any = { fileId, status: 'ACTIVE' };
        if (redactionId) where.id = redactionId;

        const redactions = await this.prisma.redaction.findMany({
            where,
            select: { elements: true },
        });

        const allElements: string[] = [];
        for (const r of redactions) {
            const elements = r.elements as RedactedElement[];
            allElements.push(...elements.map(e => e.elementId));
        }

        return [...new Set(allElements)];
    }

    /**
     * Delete a redaction set
     */
    async deleteRedaction(id: string) {
        return this.prisma.redaction.update({
            where: { id },
            data: { status: 'DELETED' },
        });
    }

    /**
     * Generate redacted view metadata for 3D viewer
     */
    async getViewerRedactionConfig(fileId: string) {
        const elements = await this.getRedactedElements(fileId);

        return {
            redactedElements: elements,
            displayMode: 'BOUNDING_BOX', // Show as bounding boxes
            color: '#808080', // Gray color for redacted
            opacity: 0.3,
        };
    }
}
