import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(createProjectDto: CreateProjectDto) {
        try {
            // Transaction ensures both project and default folders are created or fails together
            return await this.prisma.$transaction(async (tx) => {
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

                // Create root folders one by one to get their IDs
                for (const name of defaultFolders) {
                    const folder = await tx.folder.create({
                        data: {
                            name,
                            projectId: project.id,
                            parentId: null,
                        },
                    });

                    // 3. Create Discipline Sub-folders for WIP (ISO 19650-2)
                    if (name === 'WIP') {
                        // User requested full names (e.g. "Arsitek" instead of "ARCH")
                        const disciplines = ['Arsitek', 'Struktur', 'Mekanikal Elektrikal', 'Sipil', 'Lanskap'];
                        await tx.folder.createMany({
                            data: disciplines.map((disc) => ({
                                name: disc,
                                projectId: project.id,
                                parentId: folder.id,
                                discipline: disc,
                            })),
                        });
                    }
                }

                return project;
            });
        } catch (error) {
            // Handle Prisma errors
            if (error.code === 'P2002') {
                throw new BadRequestException('Project with this code already exists');
            }
            if (error.code === 'P2003') {
                throw new BadRequestException('Invalid organization reference');
            }

            // Unexpected errors
            throw new InternalServerErrorException('Failed to create project');
        }
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
        try {
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
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch projects');
        }
    }

    async findOne(id: string) {
        return this.prisma.project.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: { name?: string; code?: string }) {
        try {
            return await this.prisma.project.update({
                where: { id },
                data,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Project not found');
            }
            if (error.code === 'P2002') {
                throw new BadRequestException('Project with this code already exists');
            }
            throw new InternalServerErrorException('Failed to update project');
        }
    }

    async archive(id: string) {
        try {
            return await this.prisma.project.update({
                where: { id },
                data: {
                    status: 'ARCHIVED',
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Project not found');
            }
            throw new InternalServerErrorException('Failed to archive project');
        }
    }

    async restore(id: string) {
        return this.prisma.project.update({
            where: { id },
            data: {
                status: 'ACTIVE',
            },
        });
    }

    async getDashboardData(id: string) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                taskDeliveryPlans: {
                    include: { deliverables: true }
                },
                incidents: true,
                procurementItems: true,
                submittals: true,
                bcfTopics: true,
                billOfQuantities: {
                    include: { items: true }
                }
            }
        });

        if (!project) throw new NotFoundException('Project not found');

        // 1. Progress Calculation (Naive approach based on Task Deliverables)
        const totalTasks = project.taskDeliveryPlans.flatMap(p => p.deliverables).length;
        const completedTasks = project.taskDeliveryPlans.flatMap(p => p.deliverables).filter(d => d.status === 'DELIVERED').length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // 2. HSE Stats
        const safeManhours = 0; // Placeholder, needs HseDailyReport aggregation
        const incidentCount = project.incidents.length;

        // 3. Procurement
        const orderedItems = project.procurementItems.length;

        // 4. Quality / Docs
        const openSubmittals = project.submittals.filter(s => s.status !== 'APPROVED').length;

        // 5. BIM Issues
        const openIssues = project.bcfTopics.filter(t => t.status !== 'CLOSED').length;

        return {
            id: project.id,
            name: project.name,
            code: project.code,
            metrics: {
                progress: Math.round(progress),
                safeManhours,
                incidentCount,
                orderedItems,
                openSubmittals,
                openIssues
            },
            recentActivity: [] // Placeholder for now
        };
    }
}
