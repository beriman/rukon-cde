import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateType, DocumentStatus } from '@prisma/client';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';

@Injectable()
export class PlanningService {
    constructor(private prisma: PrismaService) { }

    async findAllTemplates(type?: TemplateType, organizationId?: string) {
        return this.prisma.documentTemplate.findMany({
            where: {
                OR: [
                    { isSystem: true }, // System templates
                    organizationId ? { organizationId } : {} // Org specific templates
                ],
                AND: type ? { type } : {}
            }
        });
    }

    async findTemplateById(id: string) {
        const template = await this.prisma.documentTemplate.findUnique({ where: { id } });
        if (!template) throw new NotFoundException('Template not found');
        return template;
    }

    // --- Documents ---

    async createDocument(userId: string, dto: CreateDocumentDto) {
        // In real app, we should validate organizationId access here

        return this.prisma.planningDocument.create({
            data: {
                title: dto.title,
                type: dto.type,
                content: dto.content,
                status: DocumentStatus.DRAFT,
                version: '1.0',
                projectId: dto.projectId,
                organizationId: dto.organizationId,
                createdBy: userId
            }
        });
    }

    async findAllDocuments(organizationId: string, projectId?: string, type?: TemplateType) {
        return this.prisma.planningDocument.findMany({
            where: {
                organizationId,
                ...(projectId ? { projectId } : {}),
                ...(type ? { type } : {})
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async findOneDocument(id: string) {
        const doc = await this.prisma.planningDocument.findUnique({
            where: { id },
            include: { project: true } // Include project details if needed
        });
        if (!doc) throw new NotFoundException('Document not found');
        return doc;
    }

    async findLatestOIR(organizationId: string) {
        return this.prisma.planningDocument.findFirst({
            where: {
                organizationId,
                type: TemplateType.OIR,
                status: DocumentStatus.PUBLISHED
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateDocument(id: string, dto: UpdateDocumentDto) {
        // Verify existence
        await this.findOneDocument(id);

        return this.prisma.planningDocument.update({
            where: { id },
            data: {
                ...dto,
                // Status update logic can be more complex (e.g. check transitions)
            }
        });
    }

    async deleteDocument(id: string) {
        // Verify existence
        await this.findOneDocument(id);

        await this.prisma.planningDocument.delete({
            where: { id }
        });

        return { success: true };
    }
}
