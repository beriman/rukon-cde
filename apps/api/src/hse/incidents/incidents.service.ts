import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncidentDto, UpdateIncidentDto, CreateActionDto } from './dto/incident.dto';
import { Prisma } from '@prisma/client';
import { NotificationService } from '../../notifications/notification.service';

@Injectable()
export class IncidentsService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) { }

    async create(projectId: string, reportedBy: string, dto: CreateIncidentDto) {
        try {
            const incident = await this.prisma.incident.create({
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

            // Send email notification for high-severity incidents
            if (['HIGH', 'LTI', 'FATALITY'].includes(dto.severity)) {
                await this.notificationService.sendIncidentNotification({
                    incidentId: incident.id,
                    type: dto.type,
                    severity: dto.severity,
                    location: dto.location,
                    reporterName: incident.reporter.name,
                    reporterEmail: incident.reporter.email,
                });
            }

            return incident;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Project or user not found');
                }
            }
            console.error('Error creating incident:', error);
            throw new InternalServerErrorException('Failed to create incident');
        }
    }

    async findAll(projectId: string, page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                this.prisma.incident.findMany({
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
                    skip,
                    take: limit,
                }),
                this.prisma.incident.count({ where: { projectId } }),
            ]);

            return {
                data,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error('Error fetching incidents:', error);
            throw new InternalServerErrorException('Failed to fetch incidents');
        }
    }

    async findOne(id: string) {
        try {
            const incident = await this.prisma.incident.findUnique({
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

            if (!incident) {
                throw new NotFoundException(`Incident with ID ${id} not found`);
            }

            return incident;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error('Error fetching incident:', error);
            throw new InternalServerErrorException('Failed to fetch incident');
        }
    }

    async update(id: string, dto: UpdateIncidentDto) {
        try {
            return await this.prisma.incident.update({
                where: { id },
                data: dto,
                include: {
                    reporter: { select: { id: true, name: true, email: true } },
                    actions: true,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Incident with ID ${id} not found`);
                }
            }
            console.error('Error updating incident:', error);
            throw new InternalServerErrorException('Failed to update incident');
        }
    }

    async addAction(incidentId: string, dto: CreateActionDto) {
        try {
            return await this.prisma.incidentAction.create({
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Incident or assignee not found');
                }
            }
            console.error('Error adding action:', error);
            throw new InternalServerErrorException('Failed to create action');
        }
    }

    async updateAction(actionId: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED') {
        try {
            return await this.prisma.incidentAction.update({
                where: { id: actionId },
                data: {
                    status,
                    completedAt: status === 'COMPLETED' || status === 'VERIFIED' ? new Date() : null,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Action with ID ${actionId} not found`);
                }
            }
            console.error('Error updating action:', error);
            throw new InternalServerErrorException('Failed to update action');
        }
    }
}
