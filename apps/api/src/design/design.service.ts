import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DesignService {
    constructor(private prisma: PrismaService) { }

    // --- Workspaces (Folders with discipline) ---

    // Mocked for now until DB connected or using real DB if available
    async getWorkspaces(projectId: string) {
        if (!projectId) return [];

        // Return mocked structure for now as per Epic 2 pattern
        return [
            { id: 'w1', name: 'WIP_ARCH', discipline: 'ARCH', projectId },
            { id: 'w2', name: 'WIP_STRUCT', discipline: 'STRUCT', projectId },
            { id: 'w3', name: 'WIP_MEP', discipline: 'MEP', projectId },
        ];
    }

    // --- References (File Links) ---
    async createReference(sourceFileId: string, targetFolderId: string) {
        // Mock implementation
        return { id: 'link-1', name: 'Linked-Model.ifc', linkSourceId: sourceFileId, folderId: targetFolderId };
    }

    // --- Markups ---
    async getMarkups(fileId: string) {
        return [
            { id: 'm1', authorId: 'user-1', type: 'cloud', data: { x: 100, y: 100 } }
        ];
    }
}
