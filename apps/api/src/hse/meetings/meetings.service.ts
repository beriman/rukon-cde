import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeetingDto } from '../inspections/dto/inspection.dto';

@Injectable()
export class MeetingsService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, dto: CreateMeetingDto) {
        return this.prisma.safetyMeeting.create({
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
    }

    async findAll(projectId: string) {
        return this.prisma.safetyMeeting.findMany({
            where: { projectId },
            orderBy: { date: 'desc' },
        });
    }
}
