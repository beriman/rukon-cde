import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportAggregatorService, ReportPeriod, AggregatedData } from './report-aggregator.service';

export interface GenerateReportDto {
    projectId: string;
    type: 'WEEKLY' | 'MONTHLY';
    startDate?: Date;
    templateId?: string;
    includePhotos?: boolean;
    executiveSummary?: string;
}

export interface GeneratedReport {
    id: string;
    projectId: string;
    type: string;
    period: ReportPeriod;
    data: AggregatedData;
    pdfUrl?: string;
    createdAt: Date;
}

export interface ReportTemplate {
    id: string;
    name: string;
    sections: string[];
    branding?: {
        logoUrl?: string;
        primaryColor?: string;
    };
}

@Injectable()
export class ReportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly aggregator: ReportAggregatorService,
    ) { }

    /**
     * Generate a report for a project
     */
    async generateReport(dto: GenerateReportDto): Promise<GeneratedReport> {
        const period = this.calculatePeriod(dto.type, dto.startDate);

        // Aggregate data
        const data = await this.aggregator.aggregateProjectData(dto.projectId, period);

        // Create report record
        const report = await this.prisma.report.create({
            data: {
                projectId: dto.projectId,
                type: dto.type,
                periodStart: period.startDate,
                periodEnd: period.endDate,
                data: JSON.stringify(data),
                executiveSummary: dto.executiveSummary,
                status: 'GENERATED',
            },
        });

        return {
            id: report.id,
            projectId: dto.projectId,
            type: dto.type,
            period,
            data,
            createdAt: report.createdAt,
        };
    }

    /**
     * Calculate period based on type
     */
    private calculatePeriod(type: 'WEEKLY' | 'MONTHLY', startDate?: Date): ReportPeriod {
        const end = startDate || new Date();
        const start = new Date(end);

        if (type === 'WEEKLY') {
            start.setDate(start.getDate() - 7);
        } else {
            start.setMonth(start.getMonth() - 1);
        }

        return { startDate: start, endDate: end, type };
    }

    /**
     * List reports for a project
     */
    async listReports(projectId: string) {
        return this.prisma.report.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }

    /**
     * Get report by ID
     */
    async getReport(id: string) {
        const report = await this.prisma.report.findUnique({ where: { id } });
        if (!report) return null;

        return {
            ...report,
            data: JSON.parse(report.data as string),
        };
    }

    /**
     * Preview report data without saving
     */
    async previewReport(dto: GenerateReportDto) {
        const period = this.calculatePeriod(dto.type, dto.startDate);
        const data = await this.aggregator.aggregateProjectData(dto.projectId, period);
        return { period, data };
    }

    // ===== TEMPLATES (Story 7.11) =====

    async listTemplates(projectId: string) {
        return this.prisma.reportTemplate.findMany({
            where: { OR: [{ projectId }, { projectId: null }] }, // Include global templates
            orderBy: { name: 'asc' },
        });
    }

    async createTemplate(data: {
        name: string;
        projectId?: string;
        sections: string[];
        branding?: object;
    }) {
        return this.prisma.reportTemplate.create({
            data: {
                name: data.name,
                projectId: data.projectId,
                sections: data.sections,
                branding: data.branding ? JSON.stringify(data.branding) : null,
            },
        });
    }

    async updateTemplate(id: string, data: Partial<ReportTemplate>) {
        return this.prisma.reportTemplate.update({
            where: { id },
            data: {
                name: data.name,
                sections: data.sections,
                branding: data.branding ? JSON.stringify(data.branding) : undefined,
            },
        });
    }

    async deleteTemplate(id: string) {
        return this.prisma.reportTemplate.delete({ where: { id } });
    }
}
