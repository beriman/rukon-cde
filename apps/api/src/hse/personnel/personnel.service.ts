import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersonnelDto } from './dto/personnel.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PersonnelService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, dto: CreatePersonnelDto) {
        try {
            return await this.prisma.hsePersonnel.create({
                data: {
                    projectId,
                    name: dto.name,
                    company: dto.company,
                    role: dto.role,
                    documents: dto.documents as any, // Cast for Prisma JsonValue
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Project not found');
                }
            }
            console.error('Error creating personnel:', error);
            throw new InternalServerErrorException('Failed to create personnel record');
        }
    }

    async findAll(projectId: string, page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                this.prisma.hsePersonnel.findMany({
                    where: { projectId },
                    orderBy: { name: 'asc' },
                    skip,
                    take: limit,
                }),
                this.prisma.hsePersonnel.count({ where: { projectId } }),
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
            console.error('Error fetching personnel:', error);
            throw new InternalServerErrorException('Failed to fetch personnel records');
        }
    }

    async findOne(id: string) {
        try {
            const personnel = await this.prisma.hsePersonnel.findUnique({
                where: { id },
            });

            if (!personnel) {
                throw new NotFoundException(`Personnel with ID ${id} not found`);
            }

            return personnel;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error('Error fetching personnel:', error);
            throw new InternalServerErrorException('Failed to fetch personnel record');
        }
    }

    async update(id: string, dto: Partial<CreatePersonnelDto>) {
        try {
            return await this.prisma.hsePersonnel.update({
                where: { id },
                data: dto as any, // Cast for Prisma type compatibility
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Personnel with ID ${id} not found`);
                }
            }
            console.error('Error updating personnel:', error);
            throw new InternalServerErrorException('Failed to update personnel record');
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.hsePersonnel.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Personnel with ID ${id} not found`);
                }
            }
            console.error('Error deleting personnel:', error);
            throw new InternalServerErrorException('Failed to delete personnel record');
        }
    }
}
