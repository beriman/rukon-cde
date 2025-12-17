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
        let cumulative = 0;

        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
            const currentDateStr = d.toISOString().split('T')[0];
            let dailyTotal = 0;

            // Sum active tasks
            for (const task of taskCosts) {
                if (d >= task.start && d < task.end) { // < End because cost is distributed per day
                    dailyTotal += task.dailyCostRate;
                }
            }

            cumulative += dailyTotal;
            result.push({
                date: currentDateStr,
                dailyCost: dailyTotal,
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
