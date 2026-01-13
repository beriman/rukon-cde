import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { LinkElementDto } from './dto/link-element.dto';
import * as csv from 'csv-parse/sync';

@Injectable()
export class SimulationService {
    constructor(private prisma: PrismaService) { }

    async uploadSchedule(file: any, dto: CreateScheduleDto) {
        if (!file) throw new BadRequestException('No file provided');

        const schedule = await this.prisma.schedule.create({
            data: {
                name: dto.name,
                type: dto.type,
                projectId: dto.projectId,
            },
        });

        if (dto.type === 'CSV') {
            await this.parseAndSaveCsv(file.buffer, schedule.id);
        } else {
            throw new BadRequestException('Only CSV supported for now');
        }

        return schedule;
    }

    private async parseAndSaveCsv(buffer: Buffer, scheduleId: string) {
        const records = csv.parse(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        // Validasi basic
        if (records.length === 0) return;
        const first = records[0];
        if (!first['Task ID'] || !first['Name']) {
            throw new BadRequestException('Invalid CSV format. Required headers: Task ID, Name, Start Date, End Date');
        }

        const tasksData = records.map((r) => ({
            scheduleId,
            taskId: r['Task ID'],
            name: r['Name'],
            startDate: new Date(r['Start Date']),
            endDate: new Date(r['End Date']),
            parentId: r['Parent ID'] || null,
        }));

        // Batch insert not strictly supported by prisma createMany with relations in some versions, 
        // but createMany is supported for simple models.
        await this.prisma.scheduleTask.createMany({
            data: tasksData,
            skipDuplicates: true,
        });
    }

    async linkTaskToElement(dto: LinkElementDto) {
        return this.prisma.simulationLink.create({
            data: {
                projectId: dto.projectId,
                scheduleTaskId: dto.scheduleTaskId,
                elementId: dto.elementId,
                modelId: dto.modelId,
                config: dto.config ?? {},
            },
        });
    }

    async getScheduleWithTasks(scheduleId: string) {
        return this.prisma.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                tasks: {
                    include: {
                        simulationLinks: true,
                    },
                },
            },
        });
    }

    async getProjectSchedules(projectId: string) {
        return this.prisma.schedule.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
