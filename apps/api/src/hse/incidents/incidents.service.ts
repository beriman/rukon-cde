import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncidentDto, UpdateIncidentDto, CreateActionDto } from './dto/incident.dto';

@Injectable()
export class IncidentsService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, reportedBy: string, dto: CreateIncidentDto) {
        return this.prisma.incident.create({
            data: {
                projectId,
                reportedBy,
                type: dto.type,
                severity: dto.severity,
                date: new Date(dto.date),
                location: dto.location,
                description: dto.description,
                witnesses: dto.witnesses,
                photos: dto.photos || [],
                status: 'OPEN',
            },
            include: {
                reporter: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async findAll(projectId: string) {
        return this.prisma.incident.findMany({
            where: { projectId },
            include: {
                reporter: { select: { id: true, name: true, email: true } },
                actions: {
                    include: {
                        assignee: { select: { id: true, name: true, email: true } },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.incident.findUnique({
            where: { id },
            include: {
                reporter: { select: { id: true, name: true, email: true } },
                actions: {
                    include: {
                        assignee: { select: { id: true, name: true, email: true } },
                    },
                },
            },
        });
    }

    async update(id: string, dto: UpdateIncidentDto) {
        return this.prisma.incident.update({
            where: { id },
            data: dto,
            include: {
                reporter: { select: { id: true, name: true, email: true } },
                actions: true,
            },
        });
    }

    async addAction(incidentId: string, dto: CreateActionDto) {
        return this.prisma.incidentAction.create({
            data: {
                incidentId,
                description: dto.description,
                assigneeId: dto.assigneeId,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                status: 'OPEN',
            },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async updateAction(actionId: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED') {
        return this.prisma.incidentAction.update({
            where: { id: actionId },
            data: {
                status,
                completedAt: status === 'COMPLETED' || status === 'VERIFIED' ? new Date() : null,
            },
        });
    }
}
