import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class OrganizationsService {
    constructor(
        private prisma: PrismaService,
        private filesService: FilesService
    ) { }

    async create(userId: string, dto: CreateOrgDto) {
        try {
            const { name, slug } = dto;

            const existingOrg = await this.prisma.organization.findUnique({
                where: { slug },
            });

            if (existingOrg) {
                throw new ConflictException('Organization slug already exists');
            }

            // Transaction to create Org and add Creator as OWNER
            return await this.prisma.$transaction(async (tx) => {
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
        } catch (error) {
            // Re-throw HTTP exceptions
            if (error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            }

            // Handle Prisma errors
            if (error.code === 'P2002') {
                throw new ConflictException('Organization with this slug already exists');
            }
            if (error.code === 'P2003') {
                throw new BadRequestException('Invalid user reference');
            }

            // Unexpected errors
            throw new InternalServerErrorException('Failed to create organization');
        }
    }

    async findAll(userId: string) {
        try {
            return await this.prisma.organization.findMany({
                where: {
                    users: {
                        some: {
                            userId,
                        },
                    },
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch organizations');
        }
    }

    async findOne(id: string, userId: string) {
        try {
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
        } catch (error) {
            // Re-throw HTTP exceptions
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Unexpected errors
            throw new InternalServerErrorException('Failed to fetch organization');
        }
    }
    async uploadLetterhead(userId: string, orgId: string, type: 'header' | 'footer', file: any) {
        // Verify access
        await this.findOne(orgId, userId);

        const subfolder = type === 'header' ? 'headers' : 'footers';
        const result = await this.filesService.uploadSystemFile(orgId, file, subfolder);

        // Update Org
        // We store the s3Key. The PdfService or Frontend will convert to URL as needed.
        const updateData = type === 'header'
            ? { letterheadHeader: result.s3Key }
            : { letterheadFooter: result.s3Key };

        return this.prisma.organization.update({
            where: { id: orgId },
            data: updateData,
        });
    }
}
