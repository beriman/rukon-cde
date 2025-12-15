import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
        try {
            // Get next claim number
            const lastClaim = await this.prisma.progressClaim.findFirst({
                where: { projectId: data.projectId },
                orderBy: { claimNumber: 'desc' },
            });

            const claimNumber = (lastClaim?.claimNumber || 0) + 1;
            const totalAmount = data.baseAmount + (data.voAmount || 0);

            return await this.prisma.progressClaim.create({
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
        } catch (error) {
            if (error.code === 'P2003') {
                throw new NotFoundException('Project or user not found');
            }
            throw new InternalServerErrorException('Failed to create claim');
        }
    }

    async submitClaim(id: string) {
        try {
            return await this.prisma.progressClaim.update({
                where: { id },
                data: { status: 'SUBMITTED' },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Claim not found');
            }
            throw new InternalServerErrorException('Failed to submit claim');
        }
    }

    async certifyClaim(id: string, certifiedAmount: number) {
        try {
            if (certifiedAmount < 0) {
                throw new BadRequestException('Certified amount cannot be negative');
            }

            return await this.prisma.progressClaim.update({
                where: { id },
                data: {
                    status: 'CERTIFIED',
                    certifiedAmount,
                    certifiedDate: new Date(),
                },
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            if (error.code === 'P2025') {
                throw new NotFoundException('Claim not found');
            }
            throw new InternalServerErrorException('Failed to certify claim');
        }
    }

    async getClaims(projectId: string) {
        try {
            return await this.prisma.progressClaim.findMany({
                where: { projectId },
                orderBy: { claimNumber: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch claims');
        }
    }

    async getClaimSummary(projectId: string) {
        try {
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
        } catch (error) {
            throw new InternalServerErrorException('Failed to calculate claim summary');
        }
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
        try {
            return await this.prisma.variationOrder.create({
                data: {
                    ...data,
                    status: 'PROPOSED',
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('VO number already exists');
            }
            if (error.code === 'P2003') {
                throw new NotFoundException('Project not found');
            }
            throw new InternalServerErrorException('Failed to create variation order');
        }
    }

    async updateVOStatus(id: string, status: string) {
        try {
            return await this.prisma.variationOrder.update({
                where: { id },
                data: { status },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Variation order not found');
            }
            throw new InternalServerErrorException('Failed to update VO status');
        }
    }

    async getVOs(projectId: string) {
        try {
            return await this.prisma.variationOrder.findMany({
                where: { projectId },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch variation orders');
        }
    }

    async getApprovedVOSum(projectId: string): Promise<number> {
        try {
            const approvedVOs = await this.prisma.variationOrder.findMany({
                where: {
                    projectId,
                    status: 'APPROVED',
                },
            });

            return approvedVOs.reduce((sum, vo) => sum + vo.costImpact, 0);
        } catch (error) {
            throw new InternalServerErrorException('Failed to calculate VO sum');
        }
    }
}
