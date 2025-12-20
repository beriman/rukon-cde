import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateMaintenanceTaskDto {
    assetId: string;
    taskType: 'PREVENTIVE' | 'CORRECTIVE' | 'BREAKDOWN';
    name: string;
    description?: string;
    frequency?: string; // "Every 3 months", "Monthly", etc.
    nextDue?: Date;
}

export interface CompleteTaskDto {
    completedBy: string;
    notes?: string;
    attachments?: string[];
}

@Injectable()
export class MaintenanceService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create maintenance task
     */
    async createTask(dto: CreateMaintenanceTaskDto) {
        return this.prisma.maintenanceTask.create({
            data: {
                assetId: dto.assetId,
                taskType: dto.taskType,
                name: dto.name,
                description: dto.description,
                frequency: dto.frequency,
                nextDue: dto.nextDue,
                status: 'PENDING',
            },
        });
    }

    /**
     * Get tasks for an asset
     */
    async getTasksForAsset(assetId: string) {
        return this.prisma.maintenanceTask.findMany({
            where: { assetId },
            orderBy: { nextDue: 'asc' },
        });
    }

    /**
     * Get overdue tasks
     */
    async getOverdueTasks(projectId: string) {
        return this.prisma.maintenanceTask.findMany({
            where: {
                asset: { projectId },
                nextDue: { lt: new Date() },
                status: { not: 'COMPLETED' },
            },
            include: {
                asset: { select: { id: true, name: true, location: true } },
            },
            orderBy: { nextDue: 'asc' },
        });
    }

    /**
     * Get upcoming tasks
     */
    async getUpcomingTasks(projectId: string, days: number = 7) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        return this.prisma.maintenanceTask.findMany({
            where: {
                asset: { projectId },
                nextDue: { gte: new Date(), lte: futureDate },
                status: { not: 'COMPLETED' },
            },
            include: {
                asset: { select: { id: true, name: true, location: true } },
            },
            orderBy: { nextDue: 'asc' },
        });
    }

    /**
     * Complete a task with sign-off
     */
    async completeTask(taskId: string, dto: CompleteTaskDto) {
        const task = await this.prisma.maintenanceTask.findUnique({
            where: { id: taskId },
        });

        if (!task) throw new Error('Task not found');

        // Calculate next due date based on frequency
        let nextDue: Date | null = null;
        if (task.frequency) {
            nextDue = this.calculateNextDue(task.frequency);
        }

        // Create completion record
        await this.prisma.maintenanceLog.create({
            data: {
                taskId,
                completedBy: dto.completedBy,
                completedAt: new Date(),
                notes: dto.notes,
                attachments: dto.attachments || [],
            },
        });

        // Update task
        if (nextDue) {
            return this.prisma.maintenanceTask.update({
                where: { id: taskId },
                data: {
                    lastCompleted: new Date(),
                    nextDue,
                    status: 'PENDING', // Reset for next cycle
                },
            });
        } else {
            return this.prisma.maintenanceTask.update({
                where: { id: taskId },
                data: {
                    lastCompleted: new Date(),
                    status: 'COMPLETED',
                },
            });
        }
    }

    /**
     * Calculate next due date from frequency string
     */
    private calculateNextDue(frequency: string): Date {
        const next = new Date();
        const lower = frequency.toLowerCase();

        if (lower.includes('daily')) {
            next.setDate(next.getDate() + 1);
        } else if (lower.includes('weekly')) {
            next.setDate(next.getDate() + 7);
        } else if (lower.includes('monthly') || lower.includes('month')) {
            const match = lower.match(/(\d+)\s*month/);
            const months = match ? parseInt(match[1]) : 1;
            next.setMonth(next.getMonth() + months);
        } else if (lower.includes('year')) {
            next.setFullYear(next.getFullYear() + 1);
        } else {
            // Default: 1 month
            next.setMonth(next.getMonth() + 1);
        }

        return next;
    }

    /**
     * Generate work orders for schedule
     */
    async generateWorkOrders(projectId: string) {
        const upcoming = await this.getUpcomingTasks(projectId, 14);

        const workOrders = upcoming.map(task => ({
            taskId: task.id,
            assetId: task.assetId,
            assetName: task.asset.name,
            taskName: task.name,
            dueDate: task.nextDue,
            priority: task.taskType === 'BREAKDOWN' ? 'HIGH' : 'NORMAL',
        }));

        return workOrders;
    }
}
