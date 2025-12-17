import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
        try {
            return await this.prisma.procurementItem.create({
                data: {
                    ...data,
                    status: 'ORDERED',
                },
            });
        } catch (error) {
            if (error.code === 'P2003') {
                throw new NotFoundException('Project not found');
            }
            throw new InternalServerErrorException('Failed to create procurement item');
        }
    }

    async updateStatus(id: string, status: ProcurementStatus) {
        try {
            return await this.prisma.procurementItem.update({
                where: { id },
                data: { status },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Procurement item not found');
            }
            throw new InternalServerErrorException('Failed to update status');
        }
    }

    async getItems(projectId: string, status?: ProcurementStatus) {
        try {
            return await this.prisma.procurementItem.findMany({
                where: {
                    projectId,
                    ...(status && { status }),
                },
                orderBy: { deliveryDate: 'asc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch procurement items');
        }
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
        try {
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

            return await this.prisma.procurementItem.createMany({
                data: items,
            });
        } catch (error) {
            if (error.code === 'P2003') {
                throw new NotFoundException('Project not found');
            }
            throw new InternalServerErrorException('Failed to import procurement items');
        }
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
        try {
            // Find or create a default Bill of Quantities for the project
            let boq = await this.prisma.billOfQuantities.findFirst({
                where: { projectId: data.projectId }
            });

            if (!boq) {
                boq = await this.prisma.billOfQuantities.create({
                    data: {
                        projectId: data.projectId,
                        name: 'Main Bill of Quantities',
                        description: 'Auto-generated BQ'
                    }
                });
            }

            return await this.prisma.boQItem.create({
                data: {
                    boqId: boq.id,
                    itemCode: data.itemCode,
                    description: data.description,
                    unit: data.unit,
                    quantity: data.plannedQty, // mapping plannedQty -> quantity
                    unitRate: data.unitPrice,  // mapping unitPrice -> unitRate
                    amount: data.plannedQty * data.unitPrice,
                    actualQty: 0,
                    workPackageId: data.workPackageId
                },
            });
        } catch (error) {
            console.error(error); // Log error for debugging
            if (error.code === 'P2003') {
                throw new NotFoundException('Project not found');
            }
            throw new InternalServerErrorException('Failed to create BQ item');
        }
    }

    async updateActualQty(id: string, actualQty: number) {
        try {
            return await this.prisma.boQItem.update({
                where: { id },
                data: { actualQty },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('BQ item not found');
            }
            throw new InternalServerErrorException('Failed to update quantity');
        }
    }

    async getBQItems(projectId: string) {
        try {
            return await this.prisma.boQItem.findMany({
                where: {
                    boq: { projectId }
                },
                orderBy: { itemCode: 'asc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch BQ items');
        }
    }

    async getBQSummary(projectId: string) {
        try {
            const items = await this.getBQItems(projectId);

            // Note: In BoQItem, quantity = planned quantity, unitRate = unit price
            const totalPlanned = items.reduce((sum, item) => sum + (item.quantity * item.unitRate), 0);
            const totalActual = items.reduce((sum, item) => sum + (item.actualQty * item.unitRate), 0);
            const variance = totalActual - totalPlanned;
            const variancePercent = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0;

            return {
                totalPlanned,
                totalActual,
                variance,
                variancePercent: parseFloat(variancePercent.toFixed(2)),
                itemCount: items.length,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to calculate BQ summary');
        }
    }
}
