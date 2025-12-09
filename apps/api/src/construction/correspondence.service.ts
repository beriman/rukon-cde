import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CorrespondenceService {
    constructor(private prisma: PrismaService) { }

    private generateReferenceNumber(type: string, count: number): string {
        const prefix = type === 'SITE_MEMO' ? 'SM' : 'SI';
        return `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }

    async create(data: {
        projectId: string;
        type: string;
        from: string;
        to: string[];
        subject: string;
        message: string;
        attachments?: string[];
    }) {
        const count = await this.prisma.correspondence.count({
            where: {
                projectId: data.projectId,
                type: data.type,
            },
        });

        const referenceNumber = this.generateReferenceNumber(data.type, count);

        return this.prisma.correspondence.create({
            data: {
                ...data,
                referenceNumber,
                status: 'SENT',
                attachments: data.attachments || [],
            },
        });
    }

    async markAsRead(id: string) {
        return this.prisma.correspondence.update({
            where: { id },
            data: { status: 'READ' },
        });
    }

    async reply(id: string, replyData: {
        from: string;
        message: string;
    }) {
        await this.prisma.correspondence.update({
            where: { id },
            data: { status: 'REPLIED' },
        });

        // In real implementation, create a linked reply correspondence
        return { success: true };
    }

    async getCorrespondences(projectId: string, type?: string) {
        return this.prisma.correspondence.findMany({
            where: {
                projectId,
                ...(type && { type }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getById(id: string) {
        return this.prisma.correspondence.findUnique({
            where: { id },
        });
    }
}
