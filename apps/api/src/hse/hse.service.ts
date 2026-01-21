import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HseStatsDto } from './dto/hse-stats.dto';

@Injectable()
export class HseService {
    constructor(private prisma: PrismaService) { }

    async getStats(projectId: string): Promise<HseStatsDto> {
        try {
            // 1. Get Total Manhours
            const reports = await this.prisma.hseDailyReport.findMany({
                where: { projectId },
                select: { manhours: true, date: true }
            });
            const totalManhours = reports.reduce((sum, report) => sum + report.manhours, 0);

            // 2. Get Incidents
            const incidents = await this.prisma.incident.findMany({
                where: { projectId },
                orderBy: { date: 'desc' }
            });

            // 3. Calculate "Free Days"
            const now = new Date();
            const lastLti = incidents.find(i => i.type === 'LTI' || i.type === 'FATALITY');
            const lastRecordable = incidents.find(i => ['LTI', 'FATALITY', 'MTI', 'RWI', 'ILLNESS'].includes(i.type));
            const lastHurt = incidents.find(i => ['LTI', 'FATALITY', 'MTI', 'RWI', 'ILLNESS', 'FIRST_AID'].includes(i.type));

            const getDaysSince = (date?: Date) => {
                if (!date) return 0;
                const diff = now.getTime() - new Date(date).getTime();
                return Math.floor(diff / (1000 * 3600 * 24));
            };

            const ltiFreeDays = lastLti ? getDaysSince(lastLti.date) : getDaysSince(reports[0]?.date);
            const recordableFreeDays = lastRecordable ? getDaysSince(lastRecordable.date) : getDaysSince(reports[0]?.date);
            const hurtFreeDays = lastHurt ? getDaysSince(lastHurt.date) : getDaysSince(reports[0]?.date);

            // 4. Calculate Rates (per 1,000,000 hours)
            const ltiCount = incidents.filter(i => i.type === 'LTI' || i.type === 'FATALITY').length;
            const triCount = incidents.filter(i => ['LTI', 'FATALITY', 'MTI', 'RWI', 'ILLNESS'].includes(i.type)).length;

            const ltiRate = totalManhours > 0 ? (ltiCount * 1000000) / totalManhours : 0;
            const triRate = totalManhours > 0 ? (triCount * 1000000) / totalManhours : 0;

            // 5. Recent Activity
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const incidentsLastMonth = incidents.filter(i => i.date >= startOfMonth).length;

            return {
                totalManhours,
                ltiFreeDays: ltiFreeDays || 0,
                recordableFreeDays: recordableFreeDays || 0,
                hurtFreeDays: hurtFreeDays || 0,
                ltiRate: parseFloat(ltiRate.toFixed(2)),
                triRate: parseFloat(triRate.toFixed(2)),
                incidentsLastMonth
            };
        } catch (error) {
            console.error('Error calculating HSE stats:', error);
            throw new InternalServerErrorException('Failed to calculate HSE statistics');
        }
    }

    async getStatsWithTrends(projectId: string): Promise<any> {
        try {
            const baseStats = await this.getStats(projectId);

            // Get data for last 12 months
            const now = new Date();
            const twelveMonthsAgo = new Date(now);
            twelveMonthsAgo.setMonth(now.getMonth() - 12);

            const reports = await this.prisma.hseDailyReport.findMany({
                where: {
                    projectId,
                    date: { gte: twelveMonthsAgo }
                },
                select: { manhours: true, date: true }
            });

            const incidents = await this.prisma.incident.findMany({
                where: {
                    projectId,
                    date: { gte: twelveMonthsAgo }
                },
                orderBy: { date: 'asc' }
            });

            // Calculate monthly trends
            const monthlyData: Record<string, { incidents: number; manhours: number; ltiCount: number; triCount: number }> = {};

            for (let i = 11; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(now.getMonth() - i);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyData[monthKey] = { incidents: 0, manhours: 0, ltiCount: 0, triCount: 0 };
            }

            // Aggregate incidents by month
            incidents.forEach(incident => {
                const monthKey = `${incident.date.getFullYear()}-${String(incident.date.getMonth() + 1).padStart(2, '0')}`;
                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].incidents++;
                    if (incident.type === 'LTI' || incident.type === 'FATALITY') {
                        monthlyData[monthKey].ltiCount++;
                    }
                    if (['LTI', 'FATALITY', 'MTI', 'RWI', 'ILLNESS'].includes(incident.type)) {
                        monthlyData[monthKey].triCount++;
                    }
                }
            });

            // Aggregate manhours by month
            reports.forEach(report => {
                const monthKey = `${report.date.getFullYear()}-${String(report.date.getMonth() + 1).padStart(2, '0')}`;
                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].manhours += report.manhours;
                }
            });

            // Calculate rates for each month
            const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => {
                return {
                    month,
                    incidents: data.incidents,
                    manhours: data.manhours,
                    ltiRate: data.manhours > 0 ? parseFloat(((data.ltiCount * 1000000) / data.manhours).toFixed(2)) : 0,
                    triRate: data.manhours > 0 ? parseFloat(((data.triCount * 1000000) / data.manhours).toFixed(2)) : 0,
                };
            });

            return {
                ...baseStats,
                monthlyTrends,
            };
        } catch (error) {
            console.error('Error calculating HSE trends:', error);
            throw new InternalServerErrorException('Failed to calculate HSE trends');
        }
    }
}
