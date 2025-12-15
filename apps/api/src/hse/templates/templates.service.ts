import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTemplateDto, CreateDrillDto } from '../dto/templates.dto';

@Injectable()
export class TemplatesService {
    constructor(private prisma: PrismaService) { }

    // Templates
    async createTemplate(dto: CreateTemplateDto) {
        return this.prisma.inspectionTemplate.create({
            data: dto as any,
        });
    }

    async getTemplates(projectId?: string) {
        return this.prisma.inspectionTemplate.findMany({
            where: projectId ? { OR: [{ projectId }, { isDefault: true }] } : { isDefault: true },
        });
    }

    // Drills
    async createDrill(projectId: string, dto: CreateDrillDto) {
        return this.prisma.emergencyDrill.create({
            data: {
                projectId,
                type: dto.type,
                date: new Date(dto.date),
                duration: dto.duration,
                participants: dto.participants,
                findings: dto.findings,
                photos: dto.photos || [],
                conductedBy: dto.conductedBy,
            },
        });
    }

    async getDrills(projectId: string) {
        return this.prisma.emergencyDrill.findMany({
            where: { projectId },
            orderBy: { date: 'desc' },
        });
    }
}
