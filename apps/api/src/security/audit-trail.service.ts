import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface AuditLogDto {
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

export interface AuditLogQuery {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}

@Injectable()
export class AuditTrailService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Log an action (append-only, immutable)
     */
    async log(dto: AuditLogDto) {
        // Generate hash for immutability verification
        const payload = JSON.stringify({
            ...dto,
            timestamp: new Date().toISOString(),
        });
        const hash = crypto.createHash('sha256').update(payload).digest('hex');

        // Get previous log hash for chain
        const lastLog = await this.prisma.auditLog.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { hash: true },
        });

        const chainHash = lastLog
            ? crypto.createHash('sha256').update(lastLog.hash + hash).digest('hex')
            : hash;

        return this.prisma.auditLog.create({
            data: {
                action: dto.action,
                entityType: dto.entityType,
                entityId: dto.entityId,
                userId: dto.userId,
                details: dto.details || {},
                ipAddress: dto.ipAddress,
                userAgent: dto.userAgent,
                hash,
                chainHash,
            },
        });
    }

    /**
     * Query audit logs with filters
     */
    async query(params: AuditLogQuery) {
        const {
            userId,
            action,
            entityType,
            entityId,
            startDate,
            endDate,
            limit = 100,
            offset = 0,
        } = params;

        const where: any = {};

        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (entityType) where.entityType = entityType;
        if (entityId) where.entityId = entityId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = startDate;
            if (endDate) where.createdAt.lte = endDate;
        }

        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);

        return { logs, total, limit, offset };
    }

    /**
     * Verify integrity of audit chain
     */
    async verifyIntegrity(startId?: string, endId?: string): Promise<boolean> {
        const logs = await this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'asc' },
            select: { id: true, hash: true, chainHash: true },
        });

        let previousHash = '';
        for (const log of logs) {
            const expectedChainHash = previousHash
                ? crypto.createHash('sha256').update(previousHash + log.hash).digest('hex')
                : log.hash;

            if (log.chainHash !== expectedChainHash) {
                return false;
            }

            previousHash = log.hash;
        }

        return true;
    }

    /**
     * Export logs for compliance reporting
     */
    async exportLogs(params: AuditLogQuery, format: 'JSON' | 'CSV' = 'JSON') {
        const { logs } = await this.query({ ...params, limit: 10000 });

        if (format === 'CSV') {
            const headers = 'Timestamp,Action,Entity Type,Entity ID,User,Details\n';
            const rows = logs.map(log =>
                `${log.createdAt.toISOString()},${log.action},${log.entityType},${log.entityId},${log.user?.email || log.userId},"${JSON.stringify(log.details)}"`
            ).join('\n');
            return headers + rows;
        }

        return logs;
    }

    /**
     * Get activity summary for dashboard
     */
    async getActivitySummary(projectId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const logs = await this.prisma.auditLog.groupBy({
            by: ['action'],
            where: {
                createdAt: { gte: startDate },
            },
            _count: { action: true },
        });

        return logs.map(l => ({
            action: l.action,
            count: l._count.action,
        }));
    }
}
