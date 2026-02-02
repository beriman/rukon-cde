import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyLogService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generate or Get a Daily Log with auto-aggregated data
     */
    async getDailyLog(projectId: string, date: Date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // 1. Check if report already exists
        let report = await this.prisma.hseDailyReport.findUnique({
            where: {
                projectId_date: { projectId, date: startOfDay }
            }
        });

        // 2. Fetch aggregate data for the day
        // - Completed Tasks from TaskDeliverable
        const completedTasks = await this.prisma.taskDeliverable.findMany({
            where: {
                taskDeliveryPlan: { projectId },
                status: 'DELIVERED',
                updatedAt: { gte: startOfDay, lte: endOfDay }
            },
            select: { id: true, title: true, type: true }
        });

        // - Site Captures (Photos)
        const photos = await this.prisma.siteCapture.findMany({
            where: {
                projectId,
                captureType: 'PHOTO',
                capturedAt: { gte: startOfDay, lte: endOfDay }
            },
            select: { fileUrl: true, commentary: true }
        });

        // - HSE Incident Count
        const incidentsCount = await this.prisma.incident.count({
            where: {
                projectId,
                date: { gte: startOfDay, lte: endOfDay }
            }
        });

        // 3. Return aggregated view
        return {
            report,
            summary: {
                completedTasksCount: completedTasks.length,
                completedTasks,
                sitePhotosCount: photos.length,
                photos,
                incidentsCount,
                safeWorkDay: incidentsCount === 0
            }
        };
    }

    async updateLog(id: string, data: any) {
        return this.prisma.hseDailyReport.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }

    /**
     * Finalize the log and prevent further automated aggregation
     */
    async finalizeLog(id: string) {
        return this.prisma.hseDailyReport.update({
            where: { id },
            data: {
                notes: (await this.prisma.hseDailyReport.findUnique({ where: { id } }))?.notes + '\n[FINALIZED BY SYSTEM]'
                // In future, add a 'status' field to HseDailyReport
            }
        });
    }
}
