import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateSafetyTagDto {
    projectId: string;
    elementId?: string;
    location: { x: number; y: number; z: number };
    tagType: 'FALL_RISK' | 'OVERHEAD_LOAD' | 'CONFINED_SPACE' | 'ELECTRICAL' | 'CHEMICAL' | 'OTHER';
    title: string;
    description?: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

@Injectable()
export class SafetyTagService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a safety tag
     */
    async createTag(dto: CreateSafetyTagDto, userId: string) {
        return this.prisma.safetyTag.create({
            data: {
                projectId: dto.projectId,
                elementId: dto.elementId,
                location: dto.location,
                tagType: dto.tagType,
                title: dto.title,
                description: dto.description,
                severity: dto.severity,
                createdById: userId,
                status: 'ACTIVE',
            },
        });
    }

    /**
     * Get all tags for 3D viewer overlay
     */
    async getTagsForViewer(projectId: string) {
        const tags = await this.prisma.safetyTag.findMany({
            where: { projectId, status: 'ACTIVE' },
            select: {
                id: true,
                elementId: true,
                location: true,
                tagType: true,
                title: true,
                severity: true,
            },
        });

        return tags.map(tag => ({
            ...tag,
            icon: this.getTagIcon(tag.tagType),
            color: this.getSeverityColor(tag.severity),
        }));
    }

    private getTagIcon(tagType: string): string {
        const icons: Record<string, string> = {
            FALL_RISK: '⚠️',
            OVERHEAD_LOAD: '🏗️',
            CONFINED_SPACE: '🚧',
            ELECTRICAL: '⚡',
            CHEMICAL: '☣️',
            OTHER: '⛔',
        };
        return icons[tagType] || '⚠️';
    }

    private getSeverityColor(severity: string): string {
        const colors: Record<string, string> = {
            HIGH: '#DC2626',
            MEDIUM: '#F59E0B',
            LOW: '#10B981',
        };
        return colors[severity] || '#6B7280';
    }

    /**
     * Get tag details
     */
    async getTag(id: string) {
        return this.prisma.safetyTag.findUnique({
            where: { id },
            include: {
                createdBy: { select: { id: true, name: true } },
            },
        });
    }

    /**
     * Remove a tag
     */
    async removeTag(id: string) {
        return this.prisma.safetyTag.update({
            where: { id },
            data: { status: 'REMOVED' },
        });
    }

    /**
     * Export safety plan
     */
    async exportSafetyPlan(projectId: string) {
        const tags = await this.prisma.safetyTag.findMany({
            where: { projectId, status: 'ACTIVE' },
            include: {
                createdBy: { select: { name: true } },
            },
            orderBy: [{ severity: 'desc' }, { tagType: 'asc' }],
        });

        return {
            projectId,
            generatedAt: new Date(),
            totalHazards: tags.length,
            byType: this.groupBy(tags, 'tagType'),
            bySeverity: this.groupBy(tags, 'severity'),
            tags,
        };
    }

    private groupBy(items: any[], key: string) {
        return items.reduce((acc, item) => {
            acc[item[key]] = (acc[item[key]] || 0) + 1;
            return acc;
        }, {});
    }
}
