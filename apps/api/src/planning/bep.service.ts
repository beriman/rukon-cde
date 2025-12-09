import { Injectable, BadRequestException } from '@nestjs/common';
import { PlanningService } from './planning.service';

@Injectable()
export class BEPService {
    constructor(private planningService: PlanningService) { }

    // In-memory locks for MVP (Section ID -> User ID)
    private sectionLocks = new Map<string, string>();

    async assignSection(documentId: string, sectionId: string, userId: string) {
        // Retrieve document, update content metadata
        const doc = await this.planningService.findOneDocument(documentId);
        const content = doc.content as any;

        if (!content.assignments) content.assignments = {};
        content.assignments[sectionId] = userId;

        // Save back
        await this.planningService.updateDocument(documentId, { content });
        return { success: true, sectionId, assignedTo: userId };
    }

    async acquireLock(documentId: string, sectionId: string, userId: string) {
        const key = `${documentId}:${sectionId}`;
        if (this.sectionLocks.has(key) && this.sectionLocks.get(key) !== userId) {
            throw new BadRequestException('Section is locked by another user');
        }
        this.sectionLocks.set(key, userId);
        // Timeout lock after 5 mins
        setTimeout(() => this.sectionLocks.delete(key), 300000);
        return { success: true, locked: true };
    }

    async releaseLock(documentId: string, sectionId: string, userId: string) {
        const key = `${documentId}:${sectionId}`;
        if (this.sectionLocks.get(key) === userId) {
            this.sectionLocks.delete(key);
            return { success: true, locked: false };
        }
        return { success: false, message: 'Not owner of lock' };
    }
}
