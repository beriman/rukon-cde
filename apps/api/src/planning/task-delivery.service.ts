import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskDeliveryService {
    constructor(private prisma: PrismaService) { }

    async updateDeliverable(id: string, data: { startDate?: Date; endDate?: Date; status?: string; assignedTo?: string }) {
        const deliverable = await this.prisma.taskDeliverable.findUnique({
            where: { id }
        });

        if (!deliverable) {
            throw new NotFoundException('Deliverable not found');
        }

        return this.prisma.taskDeliverable.update({
            where: { id },
            data: {
                ...data,
                durationDays: (data.endDate && data.startDate)
                    ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))
                    : undefined
            }
        });
    }

    async findByProject(projectId: string) {
        return this.prisma.taskDeliveryPlan.findMany({
            where: { projectId },
            include: { deliverables: true }
        });
    }
}
