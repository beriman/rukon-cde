import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction as PrismaAuditAction } from '@prisma/client';

// Extended audit actions for planning documents
export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    EXPORT_PDF = 'EXPORT_PDF',
    EXPORT_DOCX = 'EXPORT_DOCX',
    VIEW = 'VIEW',
    PUBLISH = 'PUBLISH',
    ARCHIVE = 'ARCHIVE'
}

// Mapping from planning audit actions to Prisma enum
const actionMapping: Record<AuditAction, PrismaAuditAction> = {
    [AuditAction.CREATE]: 'PROJECT_CREATE',
    [AuditAction.UPDATE]: 'PROJECT_UPDATE',
    [AuditAction.DELETE]: 'FILE_DELETE',
    [AuditAction.EXPORT_PDF]: 'FILE_DOWNLOAD',
    [AuditAction.EXPORT_DOCX]: 'FILE_DOWNLOAD',
    [AuditAction.VIEW]: 'FILE_DOWNLOAD',
    [AuditAction.PUBLISH]: 'FILE_PUBLISH',
    [AuditAction.ARCHIVE]: 'FILE_ARCHIVE'
};

export interface AuditLogEntry {
    userId: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    changes?: any;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    /**
     * Log an audit event - NOW WITH DATABASE PERSISTENCE
     */
    async log(entry: AuditLogEntry): Promise<void> {
        try {
            // Console log for debugging
            console.log('[AUDIT]', {
                timestamp: new Date().toISOString(),
                userId: entry.userId,
                action: entry.action,
                entity: `${entry.entityType}:${entry.entityId}`,
            });

            // Database persistence using Prisma AuditLog model
            await this.prisma.auditLog.create({
                data: {
                    userId: entry.userId,
                    action: actionMapping[entry.action] || 'PROJECT_UPDATE',
                    resourceType: entry.entityType,
                    resourceId: entry.entityId,
                    details: {
                        changes: entry.changes,
                        metadata: entry.metadata,
                        originalAction: entry.action,
                    },
                    ipAddress: entry.ipAddress,
                    userAgent: entry.userAgent,
                }
            });

        } catch (error) {
            // Audit logging should never crash the application
            console.error('[AUDIT ERROR]', error);
        }
    }

    /**
     * Log document creation
     */
    async logDocumentCreate(userId: string, documentId: string, documentData: any, request?: any): Promise<void> {
        await this.log({
            userId,
            action: AuditAction.CREATE,
            entityType: 'PlanningDocument',
            entityId: documentId,
            metadata: {
                title: documentData.title,
                type: documentData.type,
                status: documentData.status
            },
            ipAddress: request?.ip,
            userAgent: request?.headers?.['user-agent']
        });
    }

    /**
     * Log document update
     */
    async logDocumentUpdate(
        userId: string,
        documentId: string,
        changes: any,
        request?: any
    ): Promise<void> {
        await this.log({
            userId,
            action: AuditAction.UPDATE,
            entityType: 'PlanningDocument',
            entityId: documentId,
            changes,
            ipAddress: request?.ip,
            userAgent: request?.headers?.['user-agent']
        });
    }

    /**
     * Log document deletion (archive)
     */
    async logDocumentDelete(userId: string, documentId: string, request?: any): Promise<void> {
        await this.log({
            userId,
            action: AuditAction.DELETE,
            entityType: 'PlanningDocument',
            entityId: documentId,
            ipAddress: request?.ip,
            userAgent: request?.headers?.['user-agent']
        });
    }

    /**
     * Log document export
     */
    async logDocumentExport(
        userId: string,
        documentId: string,
        format: 'pdf' | 'docx',
        request?: any
    ): Promise<void> {
        await this.log({
            userId,
            action: format === 'pdf' ? AuditAction.EXPORT_PDF : AuditAction.EXPORT_DOCX,
            entityType: 'PlanningDocument',
            entityId: documentId,
            metadata: { format },
            ipAddress: request?.ip,
            userAgent: request?.headers?.['user-agent']
        });
    }

    /**
     * Log document view
     */
    async logDocumentView(userId: string, documentId: string, request?: any): Promise<void> {
        await this.log({
            userId,
            action: AuditAction.VIEW,
            entityType: 'PlanningDocument',
            entityId: documentId,
            ipAddress: request?.ip,
            userAgent: request?.headers?.['user-agent']
        });
    }

    /**
     * Get audit trail for a document - NOW WITH DATABASE QUERY
     */
    async getDocumentAuditTrail(documentId: string, limit: number = 50): Promise<any[]> {
        try {
            const logs = await this.prisma.auditLog.findMany({
                where: {
                    resourceType: 'PlanningDocument',
                    resourceId: documentId
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            return logs.map(log => ({
                id: log.id,
                userId: log.userId,
                userName: log.user?.name || log.user?.email,
                action: (log.details as any)?.originalAction || log.action,
                timestamp: log.createdAt,
                details: log.details,
                ipAddress: log.ipAddress,
            }));
        } catch (error) {
            console.error('[AUDIT ERROR] getDocumentAuditTrail:', error);
            return [];
        }
    }

    /**
     * Get user activity log - NOW WITH DATABASE QUERY
     */
    async getUserActivity(userId: string, limit: number = 100): Promise<any[]> {
        try {
            const logs = await this.prisma.auditLog.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });

            return logs.map(log => ({
                id: log.id,
                action: (log.details as any)?.originalAction || log.action,
                resourceType: log.resourceType,
                resourceId: log.resourceId,
                timestamp: log.createdAt,
                details: log.details,
            }));
        } catch (error) {
            console.error('[AUDIT ERROR] getUserActivity:', error);
            return [];
        }
    }
}
