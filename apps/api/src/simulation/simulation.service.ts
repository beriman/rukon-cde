import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulationLinkDto } from './dto/create-simulation-link.dto';

@Injectable()
export class SimulationService {
    constructor(private prisma: PrismaService) { }

    async createLink(projectId: string, dto: CreateSimulationLinkDto) {
        return this.prisma.simulationLink.create({
            data: {
                projectId,
                taskId: dto.taskId,
                elementId: dto.elementId,
                modelId: dto.modelId,
                config: dto.config,
            },
        });
    }

    async getLinks(projectId: string) {
        return this.prisma.simulationLink.findMany({
            where: { projectId },
            include: {
                file: {
                    select: { name: true }
                }
            }
        });
    }

    async deleteLink(id: string) {
        return this.prisma.simulationLink.delete({
            where: { id },
        });
    }
}
