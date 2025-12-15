import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CostService {
    constructor(private prisma: PrismaService) { }

    async createBoq(projectId: string, name: string, description?: string, currency = 'IDR') {
        return this.prisma.billOfQuantities.create({
            data: {
                projectId,
                name,
                description,
                currency,
            },
        });
    }

    async getBoqs(projectId: string) {
        return this.prisma.billOfQuantities.findMany({
            where: { projectId },
            include: {
                items: true,
            },
        });
    }

    async createBoqItem(boqId: string, data: any) {
        return this.prisma.boqItem.create({
            data: {
                boqId,
                ...data,
            },
        });
    }

    async getBoqItems(boqId: string) {
        return this.prisma.boqItem.findMany({
            where: { boqId },
            include: {
                mappings: true,
            },
        });
    }

    async mapCostToElement(boqItemId: string, elementGuid: string, modelId: string) {
        // Check if mapping exists?
        // One element can have multiple costs? typically yes (e.g. Concrete + Paint)
        return this.prisma.costMapping.create({
            data: {
                boqItemId,
                elementGuid,
                modelId,
            },
        });
    }

    async unmapCost(mappingId: string) {
        return this.prisma.costMapping.delete({
            where: { id: mappingId },
        });
    }

    async getProjectCostMappings(projectId: string) {
        // Get all BoQs -> Items -> Mappings
        // Optimized query
        return this.prisma.costMapping.findMany({
            where: {
                boqItem: {
                    boq: {
                        projectId: projectId
                    }
                }
            },
            include: {
                boqItem: true
            }
        });
    }
}
