import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ReportPeriod {
    startDate: Date;
    endDate: Date;
    type: 'WEEKLY' | 'MONTHLY';
}

export interface AggregatedData {
    scheduleStats: {
        totalTasks: number;
        completedTasks: number;
        overdueTasks: number;
        progressPercentage: number;
    };
    hseStats: {
        totalIncidents: number;
        bySeverity: Record<string, number>;
        safeWorkDays: number;
    };
    rfiStats: {
        totalRfis: number;
        openRfis: number;
        closedRfis: number;
        avgResponseDays: number;
    };
    bcfStats: {
        totalIssues: number;
        openIssues: number;
        resolvedIssues: number;
    };
    photos: Array<{
        id: string;
        url: string;
        caption: string;
        date: Date;
    }>;
}

@Injectable()
export class ReportAggregatorService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Aggregate all project data for a report period
     */
    async aggregateProjectData(
        projectId: string,
        period: ReportPeriod
    ): Promise<AggregatedData> {
        const [scheduleStats, hseStats, rfiStats, bcfStats, photos] = await Promise.all([
            this.getScheduleStats(projectId, period),
            this.getHseStats(projectId, period),
            this.getRfiStats(projectId, period),
            this.getBcfStats(projectId, period),
            this.getProgressPhotos(projectId, period),
        ]);

        return { scheduleStats, hseStats, rfiStats, bcfStats, photos };
    }

    private async getScheduleStats(projectId: string, period: ReportPeriod) {
        try {
            const tasks = await this.prisma.task.findMany({
                where: { projectId },
                select: { status: true, dueDate: true },
            });

            const total = tasks.length;
            const completed = tasks.filter(t => t.status === 'COMPLETED').length;
            const overdue = tasks.filter(t =>
                t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) < new Date()
            ).length;

            return {
                totalTasks: total,
                completedTasks: completed,
                overdueTasks: overdue,
                progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            };
        } catch {
            return { totalTasks: 0, completedTasks: 0, overdueTasks: 0, progressPercentage: 0 };
        }
    }

    private async getHseStats(projectId: string, period: ReportPeriod) {
        try {
            const incidents = await this.prisma.hseReport.findMany({
                where: {
                    projectId,
                    createdAt: { gte: period.startDate, lte: period.endDate },
                },
                select: { severity: true },
            });

            const bySeverity: Record<string, number> = {};
            incidents.forEach(i => {
                bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;
            });

            return {
                totalIncidents: incidents.length,
                bySeverity,
                safeWorkDays: incidents.length === 0 ? 7 : 0, // Simplified
            };
        } catch {
            return { totalIncidents: 0, bySeverity: {}, safeWorkDays: 7 };
        }
    }

    private async getRfiStats(projectId: string, period: ReportPeriod) {
        try {
            const rfis = await this.prisma.rfi.findMany({
                where: {
                    projectId,
                    createdAt: { gte: period.startDate, lte: period.endDate },
                },
                select: { status: true, createdAt: true, closedAt: true },
            });

            const total = rfis.length;
            const open = rfis.filter(r => r.status === 'OPEN').length;
            const closed = rfis.filter(r => r.status === 'CLOSED').length;

            // Calculate average response time
            const withResponse = rfis.filter(r => r.closedAt);
            const avgDays = withResponse.length > 0
                ? withResponse.reduce((sum, r) => {
                    const diff = new Date(r.closedAt!).getTime() - new Date(r.createdAt).getTime();
                    return sum + diff / (1000 * 60 * 60 * 24);
                }, 0) / withResponse.length
                : 0;

            return {
                totalRfis: total,
                openRfis: open,
                closedRfis: closed,
                avgResponseDays: Math.round(avgDays * 10) / 10,
            };
        } catch {
            return { totalRfis: 0, openRfis: 0, closedRfis: 0, avgResponseDays: 0 };
        }
    }

    private async getBcfStats(projectId: string, period: ReportPeriod) {
        try {
            const issues = await this.prisma.bcfTopic.findMany({
                where: {
                    projectId,
                    createdAt: { gte: period.startDate, lte: period.endDate },
                },
                select: { status: true },
            });

            return {
                totalIssues: issues.length,
                openIssues: issues.filter(i => i.status !== 'CLOSED').length,
                resolvedIssues: issues.filter(i => i.status === 'CLOSED').length,
            };
        } catch {
            return { totalIssues: 0, openIssues: 0, resolvedIssues: 0 };
        }
    }

    private async getProgressPhotos(projectId: string, period: ReportPeriod) {
        try {
            const photos = await this.prisma.siteCapture.findMany({
                where: {
                    projectId,
                    type: 'PHOTO',
                    createdAt: { gte: period.startDate, lte: period.endDate },
                },
                take: 6,
                orderBy: { createdAt: 'desc' },
                select: { id: true, fileUrl: true, commentary: true, createdAt: true },
            });

            return photos.map(p => ({
                id: p.id,
                url: p.fileUrl,
                caption: p.commentary || '',
                date: p.createdAt,
            }));
        } catch {
            return [];
        }
    }
}
