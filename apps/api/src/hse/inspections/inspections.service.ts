import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInspectionDto, CreateMeetingDto } from './dto/inspection.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InspectionsService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, inspectorId: string, dto: CreateInspectionDto) {
        try {
            return await this.prisma.inspectionForm.create({
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Project or inspector not found');
                }
            }
            console.error('Error creating inspection:', error);
            throw new InternalServerErrorException('Failed to create inspection');
        }
    }

    async findAll(projectId: string, page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                this.prisma.inspectionForm.findMany({
                    where: { projectId },
                    include: {
                        items: true,
                        inspector: { select: { id: true, name: true, email: true } },
                    },
                    orderBy: { date: 'desc' },
                    skip,
                    take: limit,
                }),
                this.prisma.inspectionForm.count({ where: { projectId } }),
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
            console.error('Error fetching inspections:', error);
            throw new InternalServerErrorException('Failed to fetch inspections');
        }
    }

    async createMeeting(projectId: string, dto: CreateMeetingDto) {
        try {
            return await this.prisma.safetyMeeting.create({
                data: {
                    projectId,
                    type: dto.type,
                    topic: dto.topic,
                    date: new Date(dto.date),
                    attendees: dto.attendees,
                    photo: dto.photo,
                    notes: dto.notes,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Project not found');
                }
            }
            console.error('Error creating meeting:', error);
            throw new InternalServerErrorException('Failed to create safety meeting');
        }
    }

    async findAllMeetings(projectId: string, page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                this.prisma.safetyMeeting.findMany({
                    where: { projectId },
                    orderBy: { date: 'desc' },
                    skip,
                    take: limit,
                }),
                this.prisma.safetyMeeting.count({ where: { projectId } }),
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
            console.error('Error fetching meetings:', error);
            throw new InternalServerErrorException('Failed to fetch safety meetings');
        }
    }
}
