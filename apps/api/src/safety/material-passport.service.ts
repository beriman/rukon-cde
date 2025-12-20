import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateMaterialPassportDto {
    projectId: string;
    elementId: string;
    materialType: string;
    manufacturer?: string;
    recyclabilityPercent: number; // 0-100
    salvageValue?: number;
    circularityScore?: number; // 0-100
    certifications?: string[]; // EPD, C2C, etc.
}

@Injectable()
export class MaterialPassportService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create material passport for an element
     */
    async createPassport(dto: CreateMaterialPassportDto) {
        return this.prisma.materialPassport.create({
            data: {
                projectId: dto.projectId,
                elementId: dto.elementId,
                materialType: dto.materialType,
                manufacturer: dto.manufacturer,
                recyclabilityPercent: dto.recyclabilityPercent,
                salvageValue: dto.salvageValue,
                circularityScore: dto.circularityScore || this.calculateCircularity(dto.recyclabilityPercent),
                certifications: dto.certifications || [],
            },
        });
    }

    /**
     * Calculate circularity score based on recyclability
     */
    private calculateCircularity(recyclability: number): number {
        // Simple formula: circularity = recyclability * 0.7 + 30 (base)
        return Math.min(100, Math.round(recyclability * 0.7 + 30));
    }

    /**
     * Get passport for element
     */
    async getPassport(elementId: string) {
        return this.prisma.materialPassport.findFirst({
            where: { elementId },
        });
    }

    /**
     * Search by recyclability
     */
    async searchByRecyclability(projectId: string, minPercent: number) {
        return this.prisma.materialPassport.findMany({
            where: {
                projectId,
                recyclabilityPercent: { gte: minPercent },
            },
            orderBy: { recyclabilityPercent: 'desc' },
        });
    }

    /**
     * Search by salvage value
     */
    async searchBySalvageValue(projectId: string, minValue: number) {
        return this.prisma.materialPassport.findMany({
            where: {
                projectId,
                salvageValue: { gte: minValue },
            },
            orderBy: { salvageValue: 'desc' },
        });
    }

    /**
     * Get material type summary
     */
    async getMaterialSummary(projectId: string) {
        const groups = await this.prisma.materialPassport.groupBy({
            by: ['materialType'],
            where: { projectId },
            _count: { materialType: true },
            _avg: { recyclabilityPercent: true },
        });

        return groups.map(g => ({
            material: g.materialType,
            count: g._count.materialType,
            avgRecyclability: Math.round(g._avg.recyclabilityPercent || 0),
        }));
    }

    /**
     * Generate material inventory report
     */
    async generateInventoryReport(projectId: string) {
        const passports = await this.prisma.materialPassport.findMany({
            where: { projectId },
            orderBy: { materialType: 'asc' },
        });

        const totalSalvageValue = passports.reduce((sum, p) => sum + (p.salvageValue || 0), 0);
        const avgRecyclability = passports.reduce((sum, p) => sum + p.recyclabilityPercent, 0) / passports.length || 0;

        return {
            projectId,
            generatedAt: new Date(),
            totalElements: passports.length,
            totalSalvageValue,
            avgRecyclability: Math.round(avgRecyclability),
            byMaterial: this.groupByMaterial(passports),
            passports,
        };
    }

    private groupByMaterial(passports: any[]) {
        const groups: Record<string, { count: number; salvageValue: number; avgRecyclability: number }> = {};

        for (const p of passports) {
            if (!groups[p.materialType]) {
                groups[p.materialType] = { count: 0, salvageValue: 0, avgRecyclability: 0 };
            }
            groups[p.materialType].count++;
            groups[p.materialType].salvageValue += p.salvageValue || 0;
        }

        return Object.entries(groups).map(([material, data]) => ({
            material,
            ...data,
        }));
    }

    /**
     * Export to Madaster format
     */
    async exportToMadaster(projectId: string) {
        const passports = await this.prisma.materialPassport.findMany({
            where: { projectId },
        });

        // Madaster-compatible format
        return {
            version: '1.0',
            projectId,
            exportDate: new Date().toISOString(),
            materials: passports.map(p => ({
                id: p.elementId,
                type: p.materialType,
                manufacturer: p.manufacturer,
                recyclability: p.recyclabilityPercent,
                salvageValue: p.salvageValue,
                circularity: p.circularityScore,
                certifications: p.certifications,
            })),
        };
    }
}
