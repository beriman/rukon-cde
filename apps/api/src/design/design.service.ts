import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DesignService {
    constructor(private prisma: PrismaService) { }

    // --- Workspaces (Folders with discipline) ---

    // Mocked for now until DB connected or using real DB if available
    async getWorkspaces(projectId: string) {
        return this.prisma.folder.findMany({
            where: {
                projectId,
                discipline: { not: null } // Only fetch discipline workspaces
            },
            orderBy: { name: 'asc' }
        });
    }

    async initializeWorkspaces(projectId: string) {
        const standardDisciplines = ['ARCH', 'STRUCT', 'MEP'];
        const created = [];

        for (const disc of standardDisciplines) {
            // Check if exists
            const existing = await this.prisma.folder.findFirst({
                where: { projectId, discipline: disc }
            });

            if (!existing) {
                const folder = await this.prisma.folder.create({
                    data: {
                        name: `WIP_${disc}`,
                        // path: removed as it is not in schema
                        projectId,
                        discipline: disc,
                        isSystem: true
                    }
                });
                created.push(folder);
            }
        }
        return created;
    }

    // --- References ---
    // Delegated to FilesService (Story 3.2 is handled there)

    // --- Markups (Story 3.3) ---
    async getMarkups(fileId: string) {
        return this.prisma.drawingMarkup.findMany({
            where: { fileId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                authorId: true,
                layerData: true,
                status: true,
                createdAt: true
            }
        });
    }

    async createMarkup(fileId: string, authorId: string, layerData: any) {
        return this.prisma.drawingMarkup.create({
            data: {
                fileId,
                authorId,
                layerData, // JSON
                status: 'OPEN'
            }
        });
    }

    async updateMarkupStatus(id: string, status: string) {
        return this.prisma.drawingMarkup.update({
            where: { id },
            data: { status }
        });
    }

    async deleteMarkup(id: string, userId: string) {
        // Simple ownership check ideally here, skipping for MVP speed
        return this.prisma.drawingMarkup.delete({ where: { id } });
    }
}
