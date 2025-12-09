import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcurementStatus } from '@prisma/client';

@Injectable()
export class ProcurementService {
    constructor(private prisma: PrismaService) { }

    async createItem(data: {
        projectId: string;
        name: string;
        category: string;
        quantity: number;
        unit: string;
        supplier?: string;
        orderDate?: Date;
        deliveryDate?: Date;
    }) {
        return this.prisma.procurementItem.create({
            data: {
                ...data,
                status: 'ORDERED',
            },
        });
    }

    async updateStatus(id: string, status: ProcurementStatus) {
        return this.prisma.procurementItem.update({
            where: { id },
            data: { status },
        });
    }

    async getItems(projectId: string, status?: ProcurementStatus) {
        return this.prisma.procurementItem.findMany({
            where: {
                projectId,
                ...(status && { status }),
            },
            orderBy: { deliveryDate: 'asc' },
        });
    }

    async importFromCSV(projectId: string, csvData: Array<{
        name: string;
        category: string;
        quantity: number;
        unit: string;
        supplier?: string;
        orderDate?: string;
        deliveryDate?: string;
    }>) {
        const items = csvData.map(row => ({
            projectId,
            name: row.name,
            category: row.category,
            quantity: parseFloat(String(row.quantity)),
            unit: row.unit,
            supplier: row.supplier,
            orderDate: row.orderDate ? new Date(row.orderDate) : undefined,
            deliveryDate: row.deliveryDate ? new Date(row.deliveryDate) : undefined,
            status: 'ORDERED' as ProcurementStatus,
        }));

        return this.prisma.procurementItem.createMany({
            data: items,
        });
    }

    // Bill of Quantities
    async createBQItem(data: {
        projectId: string;
        itemCode: string;
        description: string;
        unit: string;
        plannedQty: number;
        unitPrice: number;
        workPackageId?: string;
    }) {
        return this.prisma.billOfQuantities.create({
            data: {
                ...data,
                actualQty: 0,
            },
        });
    }

    async updateActualQty(id: string, actualQty: number) {
        return this.prisma.billOfQuantities.update({
            where: { id },
            data: { actualQty },
        });
    }

    async getBQItems(projectId: string) {
        return this.prisma.billOfQuantities.findMany({
            where: { projectId },
            orderBy: { itemCode: 'asc' },
        });
    }

    async getBQSummary(projectId: string) {
        const items = await this.getBQItems(projectId);

        const totalPlanned = items.reduce((sum, item) => sum + (item.plannedQty * item.unitPrice), 0);
        const totalActual = items.reduce((sum, item) => sum + (item.actualQty * item.unitPrice), 0);
        const variance = totalActual - totalPlanned;
        const variancePercent = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0;

        return {
            totalPlanned,
            totalActual,
            variance,
            variancePercent: parseFloat(variancePercent.toFixed(2)),
            itemCount: items.length,
        };
    }
}
