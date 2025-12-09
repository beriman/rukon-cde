import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(createProjectDto: CreateProjectDto) {
        // Transaction ensures both project and default folders are created or fails together
        return this.prisma.$transaction(async (tx) => {
            // 1. Create Project
            const project = await tx.project.create({
                data: {
                    name: createProjectDto.name,
                    code: createProjectDto.code,
                    organizationId: createProjectDto.organizationId,
                },
            });

            // 2. Create Default CDE Folders (ISO 19650 standard containers)
            const defaultFolders = ['WIP', 'SHARED', 'PUBLISHED', 'ARCHIVED'];

            await tx.folder.createMany({
                data: defaultFolders.map((name) => ({
                    name,
                    projectId: project.id,
                    parentId: null, // Root folders
                })),
            });

            return project;
        });
    }

    async findAll(
        organizationId: string,
        options?: {
            search?: string;
            status?: string;
            page?: number;
            limit?: number;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
        }
    ) {
        const {
            search,
            status,
            page = 1,
            limit = 50,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = options || {};

        const skip = (page - 1) * limit;

        const where: any = {
            organizationId,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                include: {
                    folders: {
                        where: { parentId: null },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prisma.project.count({ where }),
        ]);

        return {
            data: projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        return this.prisma.project.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: { name?: string; code?: string }) {
        return this.prisma.project.update({
            where: { id },
            data,
        });
    }

    async archive(id: string) {
        return this.prisma.project.update({
            where: { id },
            data: {
                status: 'ARCHIVED',
            },
        });
    }

    async restore(id: string) {
        return this.prisma.project.update({
            where: { id },
            data: {
                status: 'ACTIVE',
            },
        });
    }
}
