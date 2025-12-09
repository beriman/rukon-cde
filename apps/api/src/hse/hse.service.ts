import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HseStatsDto } from './dto/hse-stats.dto';

@Injectable()
export class HseService {
    constructor(private prisma: PrismaService) { }

    async getStats(projectId: string): Promise<HseStatsDto> {
        // 1. Get Total Manhours
        const reports = await this.prisma.hseDailyReport.findMany({
            where: { projectId },
            select: { manhours: true }
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
            if (!date) return 0; // Or project start date diff
            const diff = now.getTime() - new Date(date).getTime();
            return Math.floor(diff / (1000 * 3600 * 24));
        };

        const ltiFreeDays = lastLti ? getDaysSince(lastLti.date) : getDaysSince(reports[0]?.date); // Fallback to first report date
        const recordableFreeDays = lastRecordable ? getDaysSince(lastRecordable.date) : getDaysSince(reports[0]?.date);
        const hurtFreeDays = lastHurt ? getDaysSince(lastHurt.date) : getDaysSince(reports[0]?.date);

        // 4. Calculate Rates (per 1,000,000 hours)
        // Rate = (Number of Incidents * 1,000,000) / Total Manhours
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
    }
}
