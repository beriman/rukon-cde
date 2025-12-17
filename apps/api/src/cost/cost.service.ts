import { Injectable, NotFoundException } from '@nestjs/common';
import * as csv from 'csv-parse/sync';
import { PrismaService } from '../prisma/prisma.service';

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
        return this.prisma.boQItem.create({
            data: {
                boqId,
                ...data,
            },
        });
    }

    async getBoqItems(boqId: string) {
        return this.prisma.boQItem.findMany({
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

    async getBoqDetails(boqId: string) {
        return this.prisma.billOfQuantities.findUnique({
            where: { id: boqId },
            include: {
                items: {
                    orderBy: { itemCode: 'asc' }
                }
            }
        });
    }

    async importBoq(projectId: string, name: string, buffer: Buffer) {
        // 1. Create Header
        const boq = await this.prisma.billOfQuantities.create({
            data: {
                projectId,
                name,
                currency: 'IDR'
            }
        });

        // 2. Parse CSV
        const records = csv.parse(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        if (records.length === 0) return boq;

        // 3. Map to Prisma Data
        const items = records.map(r => ({
            boqId: boq.id,
            itemCode: r['Item Code'] || r['Code'] || '',
            description: r['Description'] || '',
            unit: r['Unit'] || 'ls',
            quantity: parseFloat(r['Quantity'] || '0'),
            unitRate: parseFloat(r['Rate'] || r['Unit Price'] || '0'),
            amount: parseFloat(r['Amount'] || '0') || (parseFloat(r['Quantity'] || '0') * parseFloat(r['Rate'] || '0'))
        }));

        // 4. Batch Insert
        await this.prisma.boQItem.createMany({
            data: items
        });

        return this.getBoqDetails(boq.id);
    }
}
