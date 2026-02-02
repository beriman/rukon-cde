import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VariationService {
    constructor(private prisma: PrismaService) { }

    async createVO(data: {
        projectId: string;
        voNumber: string;
        title: string;
        description: string;
        costImpact: number;
        timeImpact: number;
        elements?: string[]; // Array of IFC GUIDs
    }) {
        const vo = await this.prisma.variationOrder.create({
            data: {
                projectId: data.projectId,
                voNumber: data.voNumber,
                title: data.title,
                description: data.description,
                costImpact: data.costImpact,
                timeImpact: data.timeImpact,
                status: 'PROPOSED'
            }
        });

        // Link to elements (if provided)
        // Note: Currently schema might need a join table for VO <-> Elements
        // For now, we'll store in a metadata or separate table if exists
        
        return vo;
    }

    async getProjectVOs(projectId: string) {
        return this.prisma.variationOrder.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });
    }
}
