import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClaimStatus } from '@prisma/client';

@Injectable()
export class ClaimService {
    constructor(private prisma: PrismaService) { }

    async createClaim(data: {
        projectId: string;
        period: string;
        baseAmount: number;
        voAmount?: number;
        submittedBy: string;
    }) {
        // Get next claim number
        const lastClaim = await this.prisma.progressClaim.findFirst({
            where: { projectId: data.projectId },
            orderBy: { claimNumber: 'desc' },
        });

        const claimNumber = (lastClaim?.claimNumber || 0) + 1;
        const totalAmount = data.baseAmount + (data.voAmount || 0);

        return this.prisma.progressClaim.create({
            data: {
                projectId: data.projectId,
                claimNumber,
                period: data.period,
                baseAmount: data.baseAmount,
                voAmount: data.voAmount || 0,
                totalAmount,
                submittedBy: data.submittedBy,
                status: 'DRAFT',
            },
        });
    }

    async submitClaim(id: string) {
        return this.prisma.progressClaim.update({
            where: { id },
            data: { status: 'SUBMITTED' },
        });
    }

    async certifyClaim(id: string, certifiedAmount: number) {
        return this.prisma.progressClaim.update({
            where: { id },
            data: {
                status: 'CERTIFIED',
                certifiedAmount,
                certifiedDate: new Date(),
            },
        });
    }

    async getClaims(projectId: string) {
        return this.prisma.progressClaim.findMany({
            where: { projectId },
            orderBy: { claimNumber: 'desc' },
        });
    }

    async getClaimSummary(projectId: string) {
        const claims = await this.prisma.progressClaim.findMany({
            where: { projectId },
        });

        const totalClaimed = claims.reduce((sum, c) => sum + c.totalAmount, 0);
        const totalCertified = claims.reduce((sum, c) => sum + (c.certifiedAmount || 0), 0);
        const totalPaid = claims.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.totalAmount, 0);

        return {
            totalClaimed,
            totalCertified,
            totalPaid,
            outstandingPayment: totalCertified - totalPaid,
            claimCount: claims.length,
        };
    }

    // Variation Orders
    async createVO(data: {
        projectId: string;
        voNumber: string;
        title: string;
        description: string;
        costImpact: number;
        timeImpact?: number;
    }) {
        return this.prisma.variationOrder.create({
            data: {
                ...data,
                status: 'PROPOSED',
            },
        });
    }

    async updateVOStatus(id: string, status: string) {
        return this.prisma.variationOrder.update({
            where: { id },
            data: { status },
        });
    }

    async getVOs(projectId: string) {
        return this.prisma.variationOrder.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getApprovedVOSum(projectId: string): Promise<number> {
        const approvedVOs = await this.prisma.variationOrder.findMany({
            where: {
                projectId,
                status: 'APPROVED',
            },
        });

        return approvedVOs.reduce((sum, vo) => sum + vo.costImpact, 0);
    }
}
