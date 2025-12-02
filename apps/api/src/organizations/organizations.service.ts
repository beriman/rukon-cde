import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: any) {
        const { name, slug } = dto;

        const existingOrg = await this.prisma.organization.findUnique({
            where: { slug },
        });

        if (existingOrg) {
            throw new ConflictException('Organization slug already exists');
        }

        // Transaction to create Org and add Creator as OWNER
        return this.prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name,
                    slug,
                },
            });

            await tx.organizationUser.create({
                data: {
                    userId,
                    organizationId: org.id,
                    role: 'OWNER',
                },
            });

            return org;
        });
    }

    async findAll(userId: string) {
        return this.prisma.organization.findMany({
            where: {
                users: {
                    some: {
                        userId,
                    },
                },
            },
        });
    }

    async findOne(id: string, userId: string) {
        const org = await this.prisma.organization.findFirst({
            where: {
                id,
                users: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                projects: true,
            },
        });

        if (!org) {
            throw new NotFoundException('Organization not found or access denied');
        }

        return org;
    }
}
