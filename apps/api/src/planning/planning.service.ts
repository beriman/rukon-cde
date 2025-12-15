import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateType, DocumentStatus } from '@prisma/client';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';

@Injectable()
export class PlanningService {
    constructor(private prisma: PrismaService) { }

    // --- Templates ---

    async findAllTemplates(type?: TemplateType, organizationId?: string) {
        try {
            const where: any = {};

            if (type) {
                where.type = type;
            }

            // System templates (isSystem=true) or organization-specific templates
            if (organizationId) {
                where.OR = [
                    { isSystem: true },
                    { organizationId }
                ];
            } else {
                where.isSystem = true;
            }

            return await this.prisma.documentTemplate.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch templates');
        }
    }

    async findTemplateById(id: string) {
        try {
            const template = await this.prisma.documentTemplate.findUnique({
                where: { id }
            });

            if (!template) {
                throw new NotFoundException(`Template with ID ${id} not found`);
            }

            return template;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch template');
        }
    }

    // --- Documents ---

    async createDocument(userId: string, dto: CreateDocumentDto) {
        try {
            const document = await this.prisma.planningDocument.create({
                data: {
                    title: dto.title,
                    type: dto.type,
                    content: dto.content,
                    status: DocumentStatus.DRAFT,
                    version: '1.0',
                    organizationId: dto.organizationId,
                    projectId: dto.projectId,
                    createdBy: userId,
                },
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                }
            });

            return document;
        } catch (error) {
            if (error.code === 'P2003') {
                // Foreign key constraint failed
                throw new NotFoundException('Organization or Project not found');
            }
            if (error.code === 'P2002') {
                // Unique constraint failed
                throw new ConflictException('Document with this identifier already exists');
            }
            throw new InternalServerErrorException('Failed to create document');
        }
    }

    async findAllDocuments(
        organizationId: string,
        projectId?: string,
        type?: TemplateType,
        page: number = 1,
        limit: number = 20
    ) {
        try {
            const where: any = { organizationId };

            if (projectId) {
                where.projectId = projectId;
            }

            if (type) {
                where.type = type;
            }

            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                this.prisma.planningDocument.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        project: {
                            select: { name: true, code: true }
                        }
                    },
                    orderBy: { updatedAt: 'desc' }
                }),
                this.prisma.planningDocument.count({ where })
            ]);

            return {
                data,
                meta: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch documents');
        }
    }

    async findOneDocument(id: string) {
        try {
            const document = await this.prisma.planningDocument.findUnique({
                where: { id },
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                }
            });

            if (!document) {
                throw new NotFoundException(`Document with ID ${id} not found`);
            }

            return document;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch document');
        }
    }

    async findLatestOIR(organizationId: string) {
        try {
            const latestOIR = await this.prisma.planningDocument.findFirst({
                where: {
                    organizationId,
                    type: TemplateType.OIR,
                    status: DocumentStatus.PUBLISHED
                },
                orderBy: { createdAt: 'desc' }
            });

            return latestOIR;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch latest OIR');
        }
    }

    async updateDocument(id: string, dto: UpdateDocumentDto) {
        try {
            const document = await this.prisma.planningDocument.update({
                where: { id },
                data: {
                    ...(dto.title && { title: dto.title }),
                    ...(dto.content && { content: dto.content }),
                    ...(dto.status && { status: dto.status }),
                },
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                }
            });

            return document;
        } catch (error) {
            if (error.code === 'P2025') {
                // Record not found
                throw new NotFoundException(`Document with ID ${id} not found`);
            }
            throw new InternalServerErrorException('Failed to update document');
        }
    }

    async deleteDocument(id: string) {
        try {
            // Soft delete - archive the document
            await this.prisma.planningDocument.update({
                where: { id },
                data: { status: DocumentStatus.ARCHIVED }
            });

            return { success: true, message: 'Document archived successfully' };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Document with ID ${id} not found`);
            }
            throw new InternalServerErrorException('Failed to delete document');
        }
    }
}
