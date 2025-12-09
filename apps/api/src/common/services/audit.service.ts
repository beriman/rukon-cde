import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(
        userId: string,
        action: AuditAction,
        resourceId?: string,
        resourceType?: string,
        details?: any,
    ) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    resourceId,
                    resourceType,
                    details: details ? JSON.parse(JSON.stringify(details)) : undefined, // Ensure valid JSON
                },
            });
        } catch (error) {
            console.error('[AUDIT LOG ERROR] Failed to create audit log:', error);
            // Optionally: don't throw, just log error to avoid blocking the main action
        }
    }
}
