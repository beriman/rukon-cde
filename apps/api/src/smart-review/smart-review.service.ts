import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateValidationRuleDto, CreateValidationReportDto } from './dto/create-smart-review.dto';

@Injectable()
export class SmartReviewService {
    constructor(private prisma: PrismaService) { }

    // Rules
    async createRule(dto: CreateValidationRuleDto) {
        return this.prisma.validationRule.create({
            data: {
                name: dto.name,
                description: dto.description,
                category: dto.category,
                ruleType: dto.ruleType,
                config: dto.config,
            }
        });
    }

    async getRules() {
        return this.prisma.validationRule.findMany({
            where: { isActive: true }
        });
    }

    // Reports
    async createReport(dto: CreateValidationReportDto) {
        return this.prisma.validationReport.create({
            data: {
                projectId: dto.projectId,
                modelId: dto.modelId,
                result: dto.result,
                score: dto.score,
            }
        });
    }

    async getReports(projectId: string, modelId?: string) {
        return this.prisma.validationReport.findMany({
            where: {
                projectId,
                ...(modelId && { modelId })
            },
            orderBy: { createdAt: 'desc' },
            include: { file: { select: { name: true } } }
        });
    }
}
