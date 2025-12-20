import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetService } from './asset.service';

export interface HandoverChecklist {
    asBuiltModel: boolean;
    cobieData: boolean;
    omManuals: boolean;
    trainingRecords: boolean;
    warrantyDocs: boolean;
    maintenanceSchedule: boolean;
}

export interface StartHandoverDto {
    projectId: string;
    name: string;
    targetDate: Date;
}

@Injectable()
export class HandoverService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly assetService: AssetService,
    ) { }

    /**
     * Start a new handover process
     */
    async startHandover(dto: StartHandoverDto, userId: string) {
        return this.prisma.handover.create({
            data: {
                projectId: dto.projectId,
                name: dto.name,
                targetDate: dto.targetDate,
                initiatedBy: userId,
                status: 'IN_PROGRESS',
                checklist: {
                    asBuiltModel: false,
                    cobieData: false,
                    omManuals: false,
                    trainingRecords: false,
                    warrantyDocs: false,
                    maintenanceSchedule: false,
                },
            },
        });
    }

    /**
     * Get handover status
     */
    async getHandover(id: string) {
        return this.prisma.handover.findUnique({
            where: { id },
            include: {
                project: { select: { id: true, name: true } },
            },
        });
    }

    /**
     * Update checklist item
     */
    async updateChecklist(handoverId: string, item: keyof HandoverChecklist, value: boolean) {
        const handover = await this.prisma.handover.findUnique({
            where: { id: handoverId },
            select: { checklist: true },
        });

        if (!handover) throw new Error('Handover not found');

        const checklist = handover.checklist as HandoverChecklist;
        checklist[item] = value;

        return this.prisma.handover.update({
            where: { id: handoverId },
            data: { checklist },
        });
    }

    /**
     * Validate handover readiness
     */
    async validateHandover(handoverId: string): Promise<{
        ready: boolean;
        missing: string[];
        warnings: string[];
    }> {
        const handover = await this.prisma.handover.findUnique({
            where: { id: handoverId },
            select: { checklist: true, projectId: true },
        });

        if (!handover) throw new Error('Handover not found');

        const checklist = handover.checklist as HandoverChecklist;
        const missing: string[] = [];
        const warnings: string[] = [];

        // Check required items
        if (!checklist.asBuiltModel) missing.push('As-built model not uploaded');
        if (!checklist.omManuals) missing.push('O&M manuals missing');
        if (!checklist.maintenanceSchedule) missing.push('Maintenance schedule not defined');

        // Check optional items as warnings
        if (!checklist.cobieData) warnings.push('COBie data not imported');
        if (!checklist.trainingRecords) warnings.push('Training records incomplete');
        if (!checklist.warrantyDocs) warnings.push('Warranty documents not attached');

        // Check asset count
        const { total: assetCount } = await this.assetService.queryAssets({
            projectId: handover.projectId,
            limit: 1,
        });

        if (assetCount === 0) {
            missing.push('No assets imported to AIM');
        }

        return {
            ready: missing.length === 0,
            missing,
            warnings,
        };
    }

    /**
     * Complete handover and generate report
     */
    async completeHandover(handoverId: string, completedBy: string) {
        const validation = await this.validateHandover(handoverId);

        if (!validation.ready) {
            throw new Error(`Cannot complete: ${validation.missing.join(', ')}`);
        }

        const handover = await this.prisma.handover.update({
            where: { id: handoverId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                completedBy,
            },
            include: {
                project: { select: { name: true } },
            },
        });

        // Generate handover report
        const report = await this.generateHandoverReport(handoverId);

        return { handover, report };
    }

    /**
     * Generate handover report
     */
    async generateHandoverReport(handoverId: string) {
        const handover = await this.prisma.handover.findUnique({
            where: { id: handoverId },
            include: {
                project: { select: { id: true, name: true } },
            },
        });

        if (!handover) throw new Error('Handover not found');

        const { assets, total: assetCount } = await this.assetService.queryAssets({
            projectId: handover.projectId,
            limit: 1000,
        });

        const assetTypes = await this.assetService.getAssetTypesSummary(handover.projectId);

        return {
            title: `Handover Report: ${handover.project.name}`,
            date: handover.completedAt || new Date(),
            status: handover.status,
            checklist: handover.checklist,
            summary: {
                totalAssets: assetCount,
                assetTypes,
            },
            signatures: {
                preparedBy: handover.initiatedBy,
                receivedBy: handover.completedBy,
            },
        };
    }

    /**
     * Import PIM data to AIM
     */
    async importPimToAim(handoverId: string, pimData: any[]) {
        const handover = await this.prisma.handover.findUnique({
            where: { id: handoverId },
            select: { projectId: true },
        });

        if (!handover) throw new Error('Handover not found');

        // Transform PIM data to AIM assets
        const assets = pimData.map(item => ({
            projectId: handover.projectId,
            assetType: item.type || item.category || 'GENERAL',
            name: item.name || item.id,
            location: item.location || '',
            specifications: item.properties || {},
            documents: item.documents || [],
        }));

        const result = await this.assetService.bulkImport(handover.projectId, assets);

        // Update checklist
        await this.updateChecklist(handoverId, 'asBuiltModel', true);

        return result;
    }
}
