import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditTrailService } from './audit-trail.service';

export enum SensitivityLevel {
    PUBLIC = 'PUBLIC',
    INTERNAL = 'INTERNAL',
    CONFIDENTIAL = 'CONFIDENTIAL',
    HIGHLY_CONFIDENTIAL = 'HIGHLY_CONFIDENTIAL',
}

export interface ClassifyDto {
    fileId: string;
    level: SensitivityLevel;
    justification?: string;
}

@Injectable()
export class SensitivityService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly auditTrail: AuditTrailService,
    ) { }

    /**
     * Get sensitivity levels enum
     */
    getLevels() {
        return [
            { level: 'PUBLIC', description: 'Anyone can access', color: 'green' },
            { level: 'INTERNAL', description: 'Project members only', color: 'blue' },
            { level: 'CONFIDENTIAL', description: 'Specific roles only', color: 'orange' },
            { level: 'HIGHLY_CONFIDENTIAL', description: 'Named individuals only', color: 'red' },
        ];
    }

    /**
     * Classify a file with sensitivity level
     */
    async classifyFile(dto: ClassifyDto, userId: string) {
        const file = await this.prisma.file.findUnique({
            where: { id: dto.fileId },
        });

        if (!file) throw new Error('File not found');

        // Update file sensitivity
        const updated = await this.prisma.file.update({
            where: { id: dto.fileId },
            data: {
                sensitivityLevel: dto.level,
                sensitivityJustification: dto.justification,
                sensitivityClassifiedAt: new Date(),
                sensitivityClassifiedBy: userId,
            },
        });

        // Log to audit trail
        await this.auditTrail.log({
            action: 'CLASSIFY',
            entityType: 'FILE',
            entityId: dto.fileId,
            userId,
            details: { level: dto.level, justification: dto.justification },
        });

        return updated;
    }

    /**
     * Check if user can access file based on sensitivity
     */
    async canAccess(fileId: string, userId: string, userRoles: string[]): Promise<boolean> {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
            select: { sensitivityLevel: true },
        });

        if (!file) return false;

        const level = file.sensitivityLevel as SensitivityLevel;

        switch (level) {
            case SensitivityLevel.PUBLIC:
                return true;
            case SensitivityLevel.INTERNAL:
                // Check if user is project member
                return userRoles.includes('PROJECT_MEMBER') || userRoles.includes('ADMIN');
            case SensitivityLevel.CONFIDENTIAL:
                return userRoles.includes('MANAGER') || userRoles.includes('ADMIN');
            case SensitivityLevel.HIGHLY_CONFIDENTIAL:
                // Check explicit access list
                return this.checkExplicitAccess(fileId, userId);
            default:
                return true; // Unclassified defaults to accessible
        }
    }

    private async checkExplicitAccess(fileId: string, userId: string): Promise<boolean> {
        const access = await this.prisma.fileAccess.findFirst({
            where: { fileId, userId },
        });
        return !!access;
    }

    /**
     * Get files pending classification
     */
    async getPendingClassification(projectId: string) {
        return this.prisma.file.findMany({
            where: {
                projectId,
                sensitivityLevel: null,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
