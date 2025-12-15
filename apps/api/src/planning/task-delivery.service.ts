import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskDeliveryService {
    constructor(private prisma: PrismaService) { }

    async createPlan(projectId: string, name: string) {
        return this.prisma.taskDeliveryPlan.create({
            data: {
                projectId,
                name,
            },
        });
    }

    async findAllPlans(projectId: string) {
        return this.prisma.taskDeliveryPlan.findMany({
            where: { projectId },
            include: { deliverables: true },
        });
    }

    async createTask(planId: string, data: any) {
        return this.prisma.taskDeliverable.create({
            data: {
                planId,
                ...data,
                status: 'PLANNED',
            },
        });
    }

    async updateTask(id: string, data: any) {
        return this.prisma.taskDeliverable.update({
            where: { id },
            data,
        });
    }

    async deleteTask(id: string) {
        return this.prisma.taskDeliverable.delete({
            where: { id },
        });
    }

    // Helper to get all deliverables for a project (flattened for Gantt)
    async getProjectTasks(projectId: string) {
        const plans = await this.prisma.taskDeliveryPlan.findMany({
            where: { projectId },
            include: {
                deliverables: true,
            }
        });
        return plans.flatMap(p => p.deliverables);
    }
}
