import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Discipline } from '@prisma/client';

@Injectable()
export class ProgressService {
    constructor(private prisma: PrismaService) { }

    async createWorkPackage(data: {
        projectId: string;
        name: string;
        discipline: Discipline;
        weight?: number;
    }) {
        return this.prisma.workPackage.create({
            data: {
                projectId: data.projectId,
                name: data.name,
                discipline: data.discipline,
                weight: data.weight ?? 1.0,
            },
        });
    }

    async recordProgress(data: {
        workPackageId: string;
        date: Date;
        percentage: number;
        notes?: string;
        photos?: string[];
        submittedBy: string;
    }) {
        const wp = await this.prisma.workPackage.findUnique({
            where: { id: data.workPackageId },
        });

        if (!wp) {
            throw new NotFoundException('Work Package not found');
        }

        if (data.percentage < 0 || data.percentage > 100) {
            throw new Error('Percentage must be between 0 and 100');
        }

        return this.prisma.progressUpdate.create({
            data: {
                workPackageId: data.workPackageId,
                date: data.date,
                percentage: data.percentage,
                notes: data.notes,
                photos: data.photos,
                submittedBy: data.submittedBy,
            },
        });
    }

    async getProjectProgress(projectId: string, discipline?: Discipline) {
        const whereClause: any = { projectId };
        if (discipline) {
            whereClause.discipline = discipline;
        }

        const workPackages = await this.prisma.workPackage.findMany({
            where: whereClause,
            include: {
                progressUpdates: {
                    orderBy: { date: 'desc' },
                    take: 1,
                },
            },
        });

        if (workPackages.length === 0) {
            return { percentage: 0, details: [] };
        }

        let totalWeight = 0;
        let weightedProgress = 0;

        const details = workPackages.map((wp) => {
            const currentProgress = wp.progressUpdates[0]?.percentage || 0;
            totalWeight += wp.weight;
            weightedProgress += currentProgress * wp.weight;

            return {
                id: wp.id,
                name: wp.name,
                discipline: wp.discipline,
                weight: wp.weight,
                currentProgress,
                lastUpdate: wp.progressUpdates[0]?.date || null,
            };
        });

        const overallPercentage = totalWeight > 0 ? weightedProgress / totalWeight : 0;

        return {
            percentage: parseFloat(overallPercentage.toFixed(2)),
            details,
        };
    }

    async getPackageHistory(workPackageId: string) {
        return this.prisma.progressUpdate.findMany({
            where: { workPackageId },
            orderBy: { date: 'desc' },
            include: {
                submitter: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
}
