import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
    constructor(private prisma: PrismaService) { }

    async pullChanges(projectId: string, lastSync: Date, userId: string) {
        // 1. Fetch updated projects
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, updatedAt: { gt: lastSync } },
        });

        // 2. Fetch updated files (drawings/docs)
        const files = await this.prisma.file.findMany({
            where: {
                folder: { projectId },
                updatedAt: { gt: lastSync },
            },
            orderBy: { updatedAt: 'asc' },
        });

        // 3. Fetch task deliverables (for field work)
        const deliverables = await this.prisma.taskDeliverable.findMany({
            where: {
                taskDeliveryPlan: { projectId },
                updatedAt: { gt: lastSync },
            },
        });

        return {
            timestamp: new Date(),
            changes: {
                projects: project ? [project] : [],
                files: files,
                taskDeliverables: deliverables,
            },
        };
    }

    async pushChanges(projectId: string, changes: any, userId: string) {
        const results = {
            applied: [],
            conflicts: [],
            errors: [],
        };

        // Example: Handle Task Deliverable updates
        if (changes.taskDeliverables && Array.isArray(changes.taskDeliverables)) {
            for (const change of changes.taskDeliverables) {
                try {
                    // Check conflict
                    const current = await this.prisma.taskDeliverable.findUnique({
                        where: { id: change.id }
                    });

                    if (current && current.updatedAt > new Date(change.lastServerSync)) {
                        results.conflicts.push({
                            entity: 'TaskDeliverable',
                            id: change.id,
                            serverState: current,
                            clientState: change.data
                        });
                        continue;
                    }

                    // Apply update
                    const updated = await this.prisma.taskDeliverable.update({
                        where: { id: change.id },
                        data: {
                            ...change.data,
                            updatedAt: new Date()
                        }
                    });
                    results.applied.push({ entity: 'TaskDeliverable', id: change.id });

                } catch (error) {
                    results.errors.push({ entity: 'TaskDeliverable', id: change.id, error: error.message });
                }
            }
        }

        return results;
    }
}
