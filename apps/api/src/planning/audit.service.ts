import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
     * Log an audit event
     */
    async log(entry: AuditLogEntry): Promise<void> {
        try {
            // Store in audit log table (assuming AuditLog model exists)
            // If model doesn't exist, we can log to console for now
            console.log('[AUDIT]', {
                timestamp: new Date().toISOString(),
                userId: entry.userId,
                action: entry.action,
                entity: `${entry.entityType}:${entry.entityId}`,
                changes: entry.changes ? JSON.stringify(entry.changes) : null,
                metadata: entry.metadata,
                ipAddress: entry.ipAddress,
                userAgent: entry.userAgent
            });

            // TODO: Implement actual database persistence when AuditLog model is added to Prisma schema
            // await this.prisma.auditLog.create({
            //     data: {
            //         userId: entry.userId,
            //         action: entry.action,
            //         entityType: entry.entityType,
            //         entityId: entry.entityId,
            //         changes: entry.changes,
            //         metadata: entry.metadata,
            //         ipAddress: entry.ipAddress,
            //         userAgent: entry.userAgent
            //     }
            // });

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
     * Get audit trail for a document
     */
    async getDocumentAuditTrail(documentId: string, limit: number = 50): Promise<any[]> {
        // TODO: Implement when AuditLog model exists
        // return await this.prisma.auditLog.findMany({
        //     where: {
        //         entityType: 'PlanningDocument',
        //         entityId: documentId
        //     },
        //     orderBy: { createdAt: 'desc' },
        //     take: limit
        // });

        console.log(`[AUDIT] Getting audit trail for document ${documentId} (not implemented yet)`);
        return [];
    }

    /**
     * Get user activity log
     */
    async getUserActivity(userId: string, limit: number = 100): Promise<any[]> {
        // TODO: Implement when AuditLog model exists
        // return await this.prisma.auditLog.findMany({
        //     where: { userId },
        //     orderBy: { createdAt: 'desc' },
        //     take: limit
        // });

        console.log(`[AUDIT] Getting activity for user ${userId} (not implemented yet)`);
        return [];
    }
}
