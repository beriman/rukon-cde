import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateMeetingDto {
    projectId: string;
    title: string;
    date: Date;
    location?: string;
    attendees: string[];
    agenda?: string;
}

export interface CreateActionItemDto {
    meetingId: string;
    title: string;
    description?: string;
    assigneeId: string;
    dueDate: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    bcfTopicId?: string;
}

export interface UpdateActionItemDto {
    title?: string;
    description?: string;
    status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
    dueDate?: Date;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

@Injectable()
export class MeetingService {
    constructor(private readonly prisma: PrismaService) { }

    // ===== MEETINGS =====

    async createMeeting(dto: CreateMeetingDto, createdById: string) {
        return this.prisma.meeting.create({
            data: {
                projectId: dto.projectId,
                title: dto.title,
                date: dto.date,
                location: dto.location,
                attendees: dto.attendees,
                agenda: dto.agenda,
                createdById,
                status: 'SCHEDULED',
            },
        });
    }

    async getMeeting(id: string) {
        return this.prisma.meeting.findUnique({
            where: { id },
            include: {
                actionItems: {
                    include: { assignee: { select: { id: true, name: true, email: true } } },
                    orderBy: { createdAt: 'asc' },
                },
                createdBy: { select: { id: true, name: true } },
            },
        });
    }

    async listMeetings(projectId: string) {
        return this.prisma.meeting.findMany({
            where: { projectId },
            orderBy: { date: 'desc' },
            include: {
                _count: { select: { actionItems: true } },
            },
        });
    }

    async updateMeeting(id: string, data: Partial<CreateMeetingDto>) {
        return this.prisma.meeting.update({
            where: { id },
            data,
        });
    }

    async deleteMeeting(id: string) {
        return this.prisma.meeting.delete({ where: { id } });
    }

    // ===== ACTION ITEMS =====

    async createActionItem(dto: CreateActionItemDto) {
        return this.prisma.actionItem.create({
            data: {
                meetingId: dto.meetingId,
                title: dto.title,
                description: dto.description,
                assigneeId: dto.assigneeId,
                dueDate: dto.dueDate,
                priority: dto.priority,
                bcfTopicId: dto.bcfTopicId,
                status: 'OPEN',
            },
            include: { assignee: { select: { id: true, name: true, email: true } } },
        });
    }

    async updateActionItem(id: string, data: UpdateActionItemDto) {
        return this.prisma.actionItem.update({
            where: { id },
            data,
        });
    }

    async deleteActionItem(id: string) {
        return this.prisma.actionItem.delete({ where: { id } });
    }

    async getMyActionItems(userId: string, projectId?: string) {
        return this.prisma.actionItem.findMany({
            where: {
                assigneeId: userId,
                status: { not: 'CLOSED' },
                ...(projectId && { meeting: { projectId } }),
            },
            include: {
                meeting: { select: { id: true, title: true, date: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }

    // ===== CARRY OVER (Story 7.8) =====

    async getOpenItemsFromMeeting(meetingId: string) {
        return this.prisma.actionItem.findMany({
            where: { meetingId, status: { not: 'CLOSED' } },
        });
    }

    async carryOverItems(fromMeetingId: string, toMeetingId: string, itemIds: string[]) {
        const items = await this.prisma.actionItem.findMany({
            where: { id: { in: itemIds }, meetingId: fromMeetingId },
        });

        const carried = await Promise.all(
            items.map(item =>
                this.prisma.actionItem.create({
                    data: {
                        meetingId: toMeetingId,
                        title: item.title,
                        description: item.description,
                        assigneeId: item.assigneeId,
                        dueDate: item.dueDate,
                        priority: item.priority,
                        bcfTopicId: item.bcfTopicId,
                        status: 'OPEN',
                        carriedFromId: item.id,
                    },
                })
            )
        );

        return carried;
    }

    // ===== EXPORT =====

    async getMeetingForExport(id: string) {
        return this.prisma.meeting.findUnique({
            where: { id },
            include: {
                actionItems: {
                    include: {
                        assignee: { select: { name: true } },
                        bcfTopic: { select: { title: true } },
                    },
                },
                createdBy: { select: { name: true } },
                project: { select: { name: true } },
            },
        });
    }
}
