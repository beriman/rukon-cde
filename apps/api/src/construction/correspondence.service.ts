import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
        try {
            const count = await this.prisma.correspondence.count({
                where: {
                    projectId: data.projectId,
                    type: data.type,
                },
            });

            const referenceNumber = this.generateReferenceNumber(data.type, count);

            return await this.prisma.correspondence.create({
                data: {
                    ...data,
                    referenceNumber,
                    status: 'SENT',
                    attachments: data.attachments || [],
                },
            });
        } catch (error) {
            if (error.code === 'P2003') {
                throw new NotFoundException('Project not found');
            }
            throw new InternalServerErrorException('Failed to create correspondence');
        }
    }

    async markAsRead(id: string) {
        try {
            return await this.prisma.correspondence.update({
                where: { id },
                data: { status: 'READ' },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Correspondence not found');
            }
            throw new InternalServerErrorException('Failed to mark as read');
        }
    }

    async reply(id: string, replyData: {
        from: string;
        message: string;
    }) {
        try {
            await this.prisma.correspondence.update({
                where: { id },
                data: { status: 'REPLIED' },
            });

            // In real implementation, create a linked reply correspondence
            return { success: true };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Correspondence not found');
            }
            throw new InternalServerErrorException('Failed to send reply');
        }
    }

    async getCorrespondences(projectId: string, type?: string) {
        try {
            return await this.prisma.correspondence.findMany({
                where: {
                    projectId,
                    ...(type && { type }),
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch correspondences');
        }
    }

    async getById(id: string) {
        try {
            const correspondence = await this.prisma.correspondence.findUnique({
                where: { id },
            });

            if (!correspondence) {
                throw new NotFoundException('Correspondence not found');
            }

            return correspondence;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch correspondence');
        }
    }
}
