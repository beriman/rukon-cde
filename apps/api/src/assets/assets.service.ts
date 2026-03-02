import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetStatus } from '@prisma/client';

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) {}

    async create(projectId: string, dto: CreateAssetDto) {
        return this.prisma.asset.create({
            data: {
                ...dto,
                projectId,
                purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
                warrantyExpiry: dto.warrantyExpiry ? new Date(dto.warrantyExpiry) : null,
            },
        });
    }

    async findAll(projectId: string) {
        return this.prisma.asset.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByGuid(projectId: string, guid: string) {
        const asset = await this.prisma.asset.findFirst({
            where: { projectId, elementGuid: guid },
        });
        if (!asset) return null;
        return asset;
    }

    async findOne(id: string) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
        });
        if (!asset) throw new NotFoundException('Asset not found');
        return asset;
    }

    async update(id: string, data: any) {
        return this.prisma.asset.update({
            where: { id },
            data: {
                ...data,
                purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
                warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : undefined,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.asset.delete({
            where: { id },
        });
    }
}
