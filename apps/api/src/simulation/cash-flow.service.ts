import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DailyCashFlow {
    date: string;
    dailyCost: number;
    cumulativeCost: number;
}

@Injectable()
export class CashFlowService {
    constructor(private prisma: PrismaService) { }

    async getProjectCashFlow(scheduleId: string): Promise<DailyCashFlow[]> {
        // 1. Fetch Schedule with Tasks and Links
        const schedule = await this.prisma.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                tasks: {
                    include: {
                        simulationLinks: true
                    }
                }
            }
        });

        if (!schedule) throw new NotFoundException('Schedule not found');

        // 2. Fetch Cost Mappings for Elements in this project
        const costMappings = await this.prisma.costMapping.findMany({
            where: {
                boqItem: {
                    boq: { projectId: schedule.projectId }
                }
            },
            include: {
                boqItem: true
            }
        });

        // Map: GUID -> Total Cost (Sum of all BoQ items linked to this element)
        const elementCostMap = new Map<string, number>();

        for (const mapping of costMappings) {
            const currentCost = elementCostMap.get(mapping.elementGuid) || 0;
            elementCostMap.set(mapping.elementGuid, currentCost + mapping.boqItem.amount);
        }

        // 3. Calculate Task Costs
        const taskCosts = schedule.tasks.map(task => {
            let totalTaskCost = 0;

            // Sum cost of all linked elements
            for (const link of task.simulationLinks) {
                const cost = elementCostMap.get(link.elementId) || 0;
                totalTaskCost += cost;
            }

            const start = new Date(task.startDate);
            const end = new Date(task.endDate);
            const durationMs = end.getTime() - start.getTime();
            // Avoid division by zero
            const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

            return {
                ...task,
                totalCost: totalTaskCost,
                dailyCostRate: totalTaskCost / durationDays,
                start,
                end,
                durationDays
            };
        });

        // 4. Generate Time Series
        // Find min start and max end
        if (taskCosts.length === 0) return [];

        const minDate = new Date(Math.min(...taskCosts.map(t => t.start.getTime())));
        const maxDate = new Date(Math.max(...taskCosts.map(t => t.end.getTime())));

        const result: DailyCashFlow[] = [];

        // Generate all date points to ensure coverage and handle non-linear time (like DST) correctly
        // We replicate the exact sampling points used in the original loop
        const dates: Date[] = [];
        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }

        // Use a Float64Array for efficient storage of differences
        // Size is dates.length + 1 to handle the 'end' update going past the array end
        const diffArray = new Float64Array(dates.length + 1);

        if (dates.length > 0) {
            const baseTime = dates[0].getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            const datesLen = dates.length;

            // Helper to find the index of the first date >= target
            // This works like std::lower_bound
            const getIndex = (target: Date): number => {
                // Heuristic guess based on linear time
                // This gets us very close (O(1)) even with DST shifts
                let idx = Math.floor((target.getTime() - baseTime) / oneDay);

                // Clamp to valid range [0, datesLen - 1]
                if (idx < 0) idx = 0;
                if (idx >= datesLen) idx = datesLen - 1;

                // Fine-tune search (handles DST drift and small inaccuracies)
                // Search forward
                while (idx < datesLen && dates[idx] < target) {
                    idx++;
                }
                // Search backward
                while (idx > 0 && dates[idx-1] >= target) {
                    idx--;
                }
                return idx;
            };

            for (const task of taskCosts) {
                // We want the range [startI, endI)
                // startI is the first index where dates[i] >= task.start (Inclusive start)
                const startI = getIndex(task.start);

                // endI is the first index where dates[i] >= task.end.
                // Since the active condition is d < task.end, this date is EXCLUDED.
                // Thus endI is the upper bound (exclusive).
                const endI = getIndex(task.end);

                if (startI < endI) {
                    diffArray[startI] += task.dailyCostRate;
                    diffArray[endI] -= task.dailyCostRate;
                }
            }
        }

        let currentDaily = 0;
        let cumulative = 0;

        for (let i = 0; i < dates.length; i++) {
            currentDaily += diffArray[i];
            cumulative += currentDaily;

            result.push({
                date: dates[i].toISOString().split('T')[0],
                dailyCost: currentDaily,
                cumulativeCost: cumulative
            });
        }

        return result;
    }

    async getCashFlowCsv(scheduleId: string): Promise<string> {
        const data = await this.getProjectCashFlow(scheduleId);

        let csv = 'Date,Daily Cost,Cumulative Cost\n';
        for (const row of data) {
            csv += `${row.date},${row.dailyCost.toFixed(2)},${row.cumulativeCost.toFixed(2)}\n`;
        }

        return csv;
    }
}
