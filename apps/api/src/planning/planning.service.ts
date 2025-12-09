import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateType, DocumentStatus } from '@prisma/client';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';

@Injectable()
export class PlanningService {
    constructor(private prisma: PrismaService) { }

    // --- MOCK DATA STORE ---
    private mocks: any[] = [
        {
            id: 'mock-oir-1',
            title: 'Corporate OIR 2025',
            type: TemplateType.OIR,
            content: { vision: 'Digital First', goals: ['Reduce Waste', 'Improve Safety'] },
            status: DocumentStatus.PUBLISHED,
            version: '1.0',
            projectId: null,
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            project: null
        },
        {
            id: 'mock-pir-1',
            title: 'Project Alpha PIR',
            type: TemplateType.PIR,
            content: { milestones: ['Planning', 'Design', 'Construct'] },
            status: DocumentStatus.DRAFT,
            version: '0.1',
            projectId: 'proj-A',
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            project: { name: 'Project Alpha', code: 'PRJ-A' }
        }
    ];

    // --- Templates ---

    async findAllTemplates(type?: TemplateType, organizationId?: string) {
        // Mock Templates
        return [
            { id: 't1', type: TemplateType.OIR, name: 'ISO 19650-2 OIR Template', content: {}, isSystem: true },
            { id: 't2', type: TemplateType.PIR, name: 'Standard PIR Questionaire', content: {}, isSystem: true },
        ].filter(t => !type || t.type === type);
    }

    async findTemplateById(id: string) {
        return { id, type: TemplateType.BEP, name: 'Mock Template', content: {} };
    }

    // --- Documents ---

    async createDocument(userId: string, dto: CreateDocumentDto) {
        const newDoc = {
            id: `mock-${Date.now()}`,
            ...dto,
            status: DocumentStatus.DRAFT,
            version: '0.1',
            createdAt: new Date(),
            updatedAt: new Date(),
            project: { name: 'Mock Project', code: 'MP' }
        };
        this.mocks.push(newDoc);
        return newDoc;
    }

    async findAllDocuments(organizationId: string, projectId?: string, type?: TemplateType) {
        return this.mocks.filter(d =>
            (!type || d.type === type)
        );
    }

    async findOneDocument(id: string) {
        const doc = this.mocks.find(d => d.id === id);
        if (!doc) throw new NotFoundException('Document not found (Mock)');
        return doc;
    }

    async findLatestOIR(organizationId: string) {
        return this.mocks.find(d => d.type === TemplateType.OIR && d.status === DocumentStatus.PUBLISHED);
    }

    async updateDocument(id: string, dto: UpdateDocumentDto) {
        const idx = this.mocks.findIndex(d => d.id === id);
        if (idx === -1) throw new NotFoundException('Document not found');
        this.mocks[idx] = { ...this.mocks[idx], ...dto, updatedAt: new Date() };
        return this.mocks[idx];
    }

    async deleteDocument(id: string) {
        const idx = this.mocks.findIndex(d => d.id === id);
        if (idx !== -1) this.mocks.splice(idx, 1);
        return { success: true };
    }
}
