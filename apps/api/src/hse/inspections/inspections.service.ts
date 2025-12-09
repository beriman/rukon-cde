import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInspectionDto } from './dto/inspection.dto';

@Injectable()
export class InspectionsService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, inspectorId: string, dto: CreateInspectionDto) {
        return this.prisma.inspectionForm.create({
            data: {
                projectId,
                inspectorId,
                type: dto.type,
                date: new Date(dto.date),
                items: {
                    create: dto.items,
                },
            },
            include: {
                items: true,
                inspector: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async findAll(projectId: string) {
        return this.prisma.inspectionForm.findMany({
            where: { projectId },
            include: {
                items: true,
                inspector: { select: { id: true, name: true, email: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
}
