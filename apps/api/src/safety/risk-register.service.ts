import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateRiskDto {
    projectId: string;
    title: string;
    description: string;
    category: 'SAFETY' | 'SCHEDULE' | 'COST' | 'QUALITY';
    severity: number; // 1-5
    likelihood: number; // 1-5
    location?: string; // 3D coordinates or room ID
    mitigation?: string;
    ownerId?: string;
}

@Injectable()
export class RiskRegisterService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new risk
     */
    async createRisk(dto: CreateRiskDto) {
        const riskScore = dto.severity * dto.likelihood;

        return this.prisma.risk.create({
            data: {
                projectId: dto.projectId,
                title: dto.title,
                description: dto.description,
                category: dto.category,
                severity: dto.severity,
                likelihood: dto.likelihood,
                riskScore,
                location: dto.location,
                mitigation: dto.mitigation,
                ownerId: dto.ownerId,
                status: 'OPEN',
            },
        });
    }

    /**
     * Get all risks for a project
     */
    async getRisks(projectId: string, filters?: { category?: string; status?: string }) {
        const where: any = { projectId };
        if (filters?.category) where.category = filters.category;
        if (filters?.status) where.status = filters.status;

        return this.prisma.risk.findMany({
            where,
            orderBy: { riskScore: 'desc' },
            include: {
                owner: { select: { id: true, name: true } },
            },
        });
    }

    /**
     * Get high-priority risks
     */
    async getHighRisks(projectId: string) {
        return this.prisma.risk.findMany({
            where: {
                projectId,
                riskScore: { gte: 15 }, // 3*5 atau 5*3 atau lebih tinggi
                status: { not: 'CLOSED' },
            },
            orderBy: { riskScore: 'desc' },
        });
    }

    /**
     * Update risk mitigation
     */
    async updateMitigation(riskId: string, mitigation: string, residualScore?: number) {
        return this.prisma.risk.update({
            where: { id: riskId },
            data: {
                mitigation,
                residualScore,
                mitigatedAt: new Date(),
            },
        });
    }

    /**
     * Close a risk
     */
    async closeRisk(riskId: string, closedBy: string, reason: string) {
        return this.prisma.risk.update({
            where: { id: riskId },
            data: {
                status: 'CLOSED',
                closedAt: new Date(),
                closedBy,
                closeReason: reason,
            },
        });
    }

    /**
     * Get risks linked to 3D locations
     */
    async getRisksWithLocations(projectId: string) {
        return this.prisma.risk.findMany({
            where: {
                projectId,
                location: { not: null },
                status: { not: 'CLOSED' },
            },
            select: {
                id: true,
                title: true,
                category: true,
                severity: true,
                location: true,
            },
        });
    }

    /**
     * Get risk matrix summary
     */
    async getRiskMatrix(projectId: string) {
        const risks = await this.prisma.risk.findMany({
            where: { projectId, status: { not: 'CLOSED' } },
            select: { severity: true, likelihood: true },
        });

        // Build 5x5 matrix
        const matrix: number[][] = Array(5).fill(null).map(() => Array(5).fill(0));

        for (const risk of risks) {
            matrix[risk.severity - 1][risk.likelihood - 1]++;
        }

        return matrix;
    }
}
