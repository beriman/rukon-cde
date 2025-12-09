import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmittalType, SubmittalStatus } from '@prisma/client';

@Injectable()
export class SubmittalService {
    constructor(private prisma: PrismaService) { }

    private generateReferenceNumber(type: SubmittalType, count: number): string {
        const prefix = type === 'SHOP_DRAWING' ? 'SD' : type === 'METHOD_STATEMENT' ? 'MS' : 'MA';
        return `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }

    async createSubmittal(data: {
        projectId: string;
        type: SubmittalType;
        title: string;
        description?: string;
        fileId: string;
        workflowId?: string;
        submittedBy: string;
    }) {
        // Get count for reference number
        const count = await this.prisma.submittal.count({
            where: { projectId: data.projectId, type: data.type },
        });

        const referenceNumber = this.generateReferenceNumber(data.type, count);

        return this.prisma.submittal.create({
            data: {
                ...data,
                referenceNumber,
                status: 'DRAFT',
            },
            include: {
                file: true,
                submitter: { select: { id: true, name: true, email: true } },
                workflow: true,
            },
        });
    }

    async submitForApproval(id: string) {
        const submittal = await this.prisma.submittal.findUnique({ where: { id } });
        if (!submittal) throw new NotFoundException('Submittal not found');

        return this.prisma.submittal.update({
            where: { id },
            data: { status: 'SUBMITTED' },
        });
    }

    async updateStatus(id: string, status: SubmittalStatus, reviewComments?: string) {
        return this.prisma.submittal.update({
            where: { id },
            data: { status, reviewComments },
        });
    }

    async getSubmittals(projectId: string, status?: SubmittalStatus) {
        return this.prisma.submittal.findMany({
            where: {
                projectId,
                ...(status && { status }),
            },
            include: {
                file: true,
                submitter: { select: { id: true, name: true, email: true } },
                workflow: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getSubmittalById(id: string) {
        const submittal = await this.prisma.submittal.findUnique({
            where: { id },
            include: {
                file: true,
                submitter: { select: { id: true, name: true, email: true } },
                workflow: true,
                project: true,
            },
        });

        if (!submittal) throw new NotFoundException('Submittal not found');
        return submittal;
    }
}
