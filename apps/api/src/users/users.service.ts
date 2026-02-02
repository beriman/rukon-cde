import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private filesService: FilesService
    ) { }

    async findAll(organizationId: string, options?: {
        search?: string;
        role?: string;
        page?: number;
        limit?: number;
    }) {
        const { search, role, page = 1, limit = 50 } = options || {};
        const skip = (page - 1) * limit;

        const where: any = {
            organizations: {
                some: {
                    organizationId,
                },
            },
        };

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOneById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                organizations: {
                    include: {
                        organization: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findOneByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: { email: string; password: string; name?: string }) {
        return this.prisma.user.create({
            data,
        });
    }

    async updateRole(id: string, role: string) {
        return this.prisma.user.update({
            where: { id },
            data: { role: role as any },
        });
    }

    async updateProfile(id: string, data: { name?: string; phone?: string; address?: string }) {
        return this.prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                address: data.address,
                updatedAt: new Date(),
            },
        });
    }

    async deactivate(id: string) {
        // Soft delete - in future add deletedAt field
        // For now, we could update a status field or just disable login
        return this.prisma.user.update({
            where: { id },
            data: {
                // deletedAt: new Date() - requires schema update
                updatedAt: new Date(),
            },
        });
    }

    async uploadSignature(userId: string, file: Express.Multer.File) {
        const uploadRes = await this.filesService.uploadSystemFile(
            userId, // Use userId as context
            file,
            'signatures'
        );

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                signatureUrl: uploadRes.s3Key
            } as any // Cast until prisma generate
        });
    }

    async getDashboardData(userId: string) {
        // 1. Get user's organizations
        const orgUsers = await this.prisma.organizationUser.findMany({
            where: { userId },
            select: { organizationId: true },
        });
        const orgIds = orgUsers.map((ou) => ou.organizationId);

        if (orgIds.length === 0) {
            return [];
        }

        // 2. Get projects in these organizations
        const projects = await this.prisma.project.findMany({
            where: {
                organizationId: { in: orgIds },
                status: 'ACTIVE',
            },
            select: {
                id: true,
                name: true,
                code: true,
                organization: {
                    select: { name: true },
                },
                taskDeliveryPlans: {
                    select: {
                        deliverables: {
                            where: {
                                assignedTo: userId,
                                NOT: { status: 'DELIVERED' },
                            },
                            select: {
                                id: true,
                                title: true,
                                status: true,
                                endDate: true,
                            },
                        },
                    },
                },
                incidents: {
                    where: {
                        actions: {
                            some: {
                                assigneeId: userId,
                                NOT: { status: { in: ['COMPLETED', 'VERIFIED'] } },
                            },
                        },
                    },
                    select: {
                        actions: {
                            where: {
                                assigneeId: userId,
                                NOT: { status: { in: ['COMPLETED', 'VERIFIED'] } },
                            },
                            select: {
                                id: true,
                                description: true,
                                status: true,
                                dueDate: true,
                            },
                        },
                    },
                },
                bcfTopics: {
                    where: {
                        assignedTo: userId,
                        NOT: { status: 'CLOSED' },
                    },
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                    },
                },
            },
        });

        // 3. Transform data
        return projects.map((project) => {
            const deliverables = project.taskDeliveryPlans.flatMap((p) =>
                p.deliverables.map((d) => ({
                    id: d.id,
                    title: d.title,
                    status: d.status,
                    dueDate: d.endDate,
                    type: 'DELIVERABLE',
                })),
            );

            const incidentActions = project.incidents.flatMap((i) =>
                i.actions.map((a) => ({
                    id: a.id,
                    title: a.description,
                    status: a.status,
                    dueDate: a.dueDate,
                    type: 'INCIDENT_ACTION',
                })),
            );

            const bcfTopics = project.bcfTopics.map((t) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                dueDate: null, // BCF topics might not have a direct due date in this selection
                type: 'BCF_TOPIC',
                priority: t.priority,
            }));

            const tasks = [...deliverables, ...incidentActions, ...bcfTopics];

            return {
                id: project.id,
                name: project.name,
                code: project.code,
                organizationName: project.organization.name,
                taskCount: tasks.length,
                tasks: tasks,
            };
        });
    }
}
