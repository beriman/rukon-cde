import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

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
}
