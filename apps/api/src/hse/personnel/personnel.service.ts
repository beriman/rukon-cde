import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersonnelDto } from './dto/personnel.dto';

@Injectable()
export class PersonnelService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, dto: CreatePersonnelDto) {
        return this.prisma.hsePersonnel.create({
            data: {
                projectId,
                name: dto.name,
                company: dto.company,
                role: dto.role,
                documents: dto.documents,
            },
        });
    }

    async findAll(projectId: string) {
        return this.prisma.hsePersonnel.findMany({
            where: { projectId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.hsePersonnel.findUnique({
            where: { id },
        });
    }

    async update(id: string, dto: Partial<CreatePersonnelDto>) {
        return this.prisma.hsePersonnel.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.hsePersonnel.delete({
            where: { id },
        });
    }
}
