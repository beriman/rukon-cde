import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAssetDto {
    projectId: string;
    assetType: string;
    name: string;
    location: string;
    specifications?: Record<string, any>;
    installDate?: Date;
    warrantyExpiry?: Date;
    documents?: string[];
    iotDeviceId?: string;
}

export interface AssetQuery {
    projectId: string;
    assetType?: string;
    location?: string;
    search?: string;
    limit?: number;
    offset?: number;
}

@Injectable()
export class AssetService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new asset in AIM
     */
    async createAsset(dto: CreateAssetDto) {
        return this.prisma.asset.create({
            data: {
                projectId: dto.projectId,
                assetType: dto.assetType,
                name: dto.name,
                location: dto.location,
                specifications: dto.specifications || {},
                installDate: dto.installDate,
                warrantyExpiry: dto.warrantyExpiry,
                documents: dto.documents || [],
                iotDeviceId: dto.iotDeviceId,
                status: 'ACTIVE',
            },
        });
    }

    /**
     * Get asset by ID with maintenance history
     */
    async getAsset(id: string) {
        return this.prisma.asset.findUnique({
            where: { id },
            include: {
                maintenanceTasks: {
                    orderBy: { nextDue: 'asc' },
                    take: 10,
                },
            },
        });
    }

    /**
     * Query assets with filters
     */
    async queryAssets(params: AssetQuery) {
        const { projectId, assetType, location, search, limit = 50, offset = 0 } = params;

        const where: any = { projectId };
        if (assetType) where.assetType = assetType;
        if (location) where.location = { contains: location };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { assetType: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                orderBy: { name: 'asc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.asset.count({ where }),
        ]);

        return { assets, total, limit, offset };
    }

    /**
     * Update asset
     */
    async updateAsset(id: string, data: Partial<CreateAssetDto>) {
        return this.prisma.asset.update({
            where: { id },
            data,
        });
    }

    /**
     * Get asset types summary
     */
    async getAssetTypesSummary(projectId: string) {
        const groups = await this.prisma.asset.groupBy({
            by: ['assetType'],
            where: { projectId },
            _count: { assetType: true },
        });

        return groups.map(g => ({
            type: g.assetType,
            count: g._count.assetType,
        }));
    }

    /**
     * Import assets from PIM (bulk create)
     */
    async bulkImport(projectId: string, assets: CreateAssetDto[]) {
        const created = await this.prisma.asset.createMany({
            data: assets.map(a => ({
                ...a,
                projectId,
                specifications: a.specifications || {},
                documents: a.documents || [],
                status: 'ACTIVE',
            })),
        });

        return { imported: created.count };
    }

    /**
     * Get assets with expiring warranties
     */
    async getExpiringWarranties(projectId: string, daysAhead: number = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);

        return this.prisma.asset.findMany({
            where: {
                projectId,
                warrantyExpiry: {
                    lte: futureDate,
                    gte: new Date(),
                },
            },
            orderBy: { warrantyExpiry: 'asc' },
        });
    }
}
