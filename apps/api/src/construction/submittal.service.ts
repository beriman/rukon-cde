import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmittalType, SubmittalStatus } from '@prisma/client';

@Injectable()
export class SubmittalService {
    constructor(private prisma: PrismaService) { }

    private generateReferenceNumber(type: string, count: number): string {
        const prefix = {
            'SHOP_DRAWING': 'SD',
            'METHOD_STATEMENT': 'MS',
            'MATERIAL_APPROVAL': 'MA',
        }[type] || 'SUB';

        return `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }

    async createSubmittal(data: {
        projectId: string;
        type: SubmittalType;
        title: string;
        fileId?: string;
        submittedBy: string;
    }) {
        try {
            const count = await this.prisma.submittal.count({
                where: {
                    projectId: data.projectId,
                    type: data.type,
                },
            });

            const referenceNumber = this.generateReferenceNumber(data.type, count);

            return await this.prisma.submittal.create({
                data: {
                    projectId: data.projectId,
                    type: data.type,
                    referenceNumber,
                    title: data.title,
                    fileId: data.fileId,
                    submittedBy: data.submittedBy,
                    status: 'DRAFT' as SubmittalStatus,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Submittal with this reference number already exists');
            }
            if (error.code === 'P2003') {
                throw new NotFoundException('Related resource not found');
            }
            throw new InternalServerErrorException('Failed to create submittal');
        }
    }

    async submitForApproval(id: string) {
        try {
            const submittal = await this.prisma.submittal.findUnique({ where: { id } });

            if (!submittal) {
                throw new NotFoundException('Submittal not found');
            }

            return await this.prisma.submittal.update({
                where: { id },
                data: { status: 'SUBMITTED' as SubmittalStatus },
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to submit');
        }
    }

    async updateStatus(id: string, status: SubmittalStatus) {
        try {
            return await this.prisma.submittal.update({
                where: { id },
                data: { status },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Submittal not found');
            }
            throw new InternalServerErrorException('Failed to update status');
        }
    }

    async getSubmittals(projectId: string, type?: SubmittalType) {
        try {
            return await this.prisma.submittal.findMany({
                where: {
                    projectId,
                    ...(type && { type }),
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch submittals');
        }
    }

    async getSubmittalById(id: string) {
        try {
            const submittal = await this.prisma.submittal.findUnique({
                where: { id },
                include: {
                    file: true,
                    submitter: { select: { id: true, name: true, email: true } },
                },
            });

            if (!submittal) {
                throw new NotFoundException('Submittal not found');
            }

            return submittal;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch submittal');
        }
    }
}
