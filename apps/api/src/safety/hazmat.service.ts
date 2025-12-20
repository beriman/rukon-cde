import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateHazmatDto {
    projectId: string;
    elementId: string;
    materialType: string; // Asbestos, Lead paint, PCB, etc.
    location: string;
    quantity?: string;
    removalPriority?: number;
    msdsUrl?: string;
}

@Injectable()
export class HazmatService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Tag an element as containing hazardous material
     */
    async createHazmatTag(dto: CreateHazmatDto, userId: string) {
        return this.prisma.hazmatTag.create({
            data: {
                projectId: dto.projectId,
                elementId: dto.elementId,
                materialType: dto.materialType,
                location: dto.location,
                quantity: dto.quantity,
                removalPriority: dto.removalPriority,
                msdsUrl: dto.msdsUrl,
                createdById: userId,
                status: 'IDENTIFIED',
            },
        });
    }

    /**
     * Get all hazmat tags for project (viewer layer)
     */
    async getHazmatLayer(projectId: string) {
        return this.prisma.hazmatTag.findMany({
            where: { projectId, status: { not: 'REMOVED' } },
            select: {
                id: true,
                elementId: true,
                materialType: true,
                location: true,
                removalPriority: true,
            },
        });
    }

    /**
     * Get hazmat by material type
     */
    async getByMaterialType(projectId: string, materialType: string) {
        return this.prisma.hazmatTag.findMany({
            where: { projectId, materialType },
            orderBy: { removalPriority: 'asc' },
        });
    }

    /**
     * Update removal status
     */
    async updateRemovalStatus(id: string, status: 'SCHEDULED' | 'IN_PROGRESS' | 'REMOVED', notes?: string) {
        return this.prisma.hazmatTag.update({
            where: { id },
            data: {
                status,
                removalNotes: notes,
                ...(status === 'REMOVED' && { removedAt: new Date() }),
            },
        });
    }

    /**
     * Get material type summary
     */
    async getMaterialSummary(projectId: string) {
        const groups = await this.prisma.hazmatTag.groupBy({
            by: ['materialType'],
            where: { projectId, status: { not: 'REMOVED' } },
            _count: { materialType: true },
        });

        return groups.map(g => ({
            material: g.materialType,
            count: g._count.materialType,
        }));
    }

    /**
     * Generate removal plan with sequencing
     */
    async generateRemovalPlan(projectId: string) {
        const hazmats = await this.prisma.hazmatTag.findMany({
            where: { projectId, status: { not: 'REMOVED' } },
            orderBy: { removalPriority: 'asc' },
        });

        // Group by priority for phased removal
        const phases: Record<number, any[]> = {};
        for (const hm of hazmats) {
            const priority = hm.removalPriority || 3;
            if (!phases[priority]) phases[priority] = [];
            phases[priority].push(hm);
        }

        return {
            projectId,
            generatedAt: new Date(),
            totalItems: hazmats.length,
            phases: Object.entries(phases).map(([priority, items]) => ({
                priority: parseInt(priority),
                items,
                estimatedDuration: `${items.length * 2} days`, // Rough estimate
            })),
        };
    }
}
