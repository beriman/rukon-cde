import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MIDPService {
    constructor(private prisma: PrismaService) { }

    // Aggregates all deliverables from all TIDPs in a project
    async getAggregate(projectId: string) {
        const deliverables = await this.prisma.taskDeliverable.findMany({
            where: {
                taskDeliveryPlan: {
                    projectId: projectId
                }
            },
            include: {
                taskDeliveryPlan: true // To show origin TIDP
            },
            orderBy: {
                endDate: 'asc'
            }
        });

        const conflicts = this.detectConflicts(deliverables);

        return {
            projectId,
            totalDeliverables: deliverables.length,
            conflicts,
            deliverables
        };
    }

    private detectConflicts(deliverables: any[]) {
        const conflicts = [];
        const seenNumbers = new Map<string, string>(); // Number -> ID

        for (const item of deliverables) {
            // Simplified check: Duplicate Document Number
            if (item.number && seenNumbers.has(item.number)) {
                conflicts.push({
                    type: 'DUPLICATE_NUMBER',
                    details: `Document Number ${item.number} is used by multiple items`,
                    itemIds: [seenNumbers.get(item.number), item.id]
                });
            } else if (item.number) {
                seenNumbers.set(item.number, item.id);
            }
        }
        return conflicts;
    }
}
