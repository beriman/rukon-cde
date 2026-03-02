import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PredictionService {
    constructor(private prisma: PrismaService) { }

    /**
     * Predict project delay based on MIDP submission velocity
     */
    async predictDelay(projectId: string) {
        const deliverables = await this.prisma.taskDeliverable.findMany({
            where: { taskDeliveryPlan: { projectId } }
        });

        if (deliverables.length === 0) return { status: 'NO_DATA' };

        const totalPlanned = deliverables.length;
        const submitted = deliverables.filter(d => d.status === 'DELIVERED').length;
        
        // Calculate submission rate
        const submissionRate = submitted / totalPlanned;

        // Current time vs Project duration
        const firstDate = new Date(Math.min(...deliverables.filter(d => d.startDate).map(d => d.startDate!.getTime())));
        const lastDate = new Date(Math.max(...deliverables.filter(d => d.endDate).map(d => d.endDate!.getTime())));
        const totalDuration = lastDate.getTime() - firstDate.getTime();
        const elapsed = new Date().getTime() - firstDate.getTime();
        const timeRate = elapsed / totalDuration;

        // Prediction Logic
        let delayDays = 0;
        let healthScore = 100;

        if (submissionRate < timeRate) {
            const projectedEnd = firstDate.getTime() + (totalDuration / (submissionRate || 0.01));
            delayDays = Math.ceil((projectedEnd - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            healthScore = Math.max(0, 100 - (delayDays * 2));
        }

        return {
            projectId,
            submissionRate: Math.round(submissionRate * 100),
            timeRate: Math.round(timeRate * 100),
            projectedDelayDays: delayDays,
            healthScore,
            status: delayDays > 7 ? 'CRITICAL' : delayDays > 0 ? 'WARNING' : 'STABLE'
        };
    }
}
