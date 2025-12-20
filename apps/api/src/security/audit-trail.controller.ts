import { Controller, Get, Post, Body, Query, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditTrailService, AuditLogQuery } from './audit-trail.service';

@Controller('security/audit')
@UseGuards(JwtAuthGuard)
export class AuditTrailController {
    constructor(private readonly auditService: AuditTrailService) { }

    @Get()
    async query(@Query() params: AuditLogQuery) {
        return this.auditService.query(params);
    }

    @Get('verify')
    async verifyIntegrity() {
        const isValid = await this.auditService.verifyIntegrity();
        return { valid: isValid };
    }

    @Get('export')
    async export(
        @Query() params: AuditLogQuery,
        @Query('format') format: 'JSON' | 'CSV' = 'JSON',
        @Res() res: Response,
    ) {
        const data = await this.auditService.exportLogs(params, format);

        if (format === 'CSV') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
            return res.send(data);
        }

        return res.json(data);
    }

    @Get('summary/:projectId')
    async getSummary(@Query('projectId') projectId: string, @Query('days') days: number = 7) {
        return this.auditService.getActivitySummary(projectId, days);
    }
}
