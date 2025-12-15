import { Test, TestingModule } from '@nestjs/testing';
import { PlanningService } from './planning.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { TemplateType, DocumentStatus } from '@prisma/client';

describe('PlanningService', () => {
    let service: PlanningService;
    let prisma: PrismaService;

    const mockPrismaService = {
        documentTemplate: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        planningDocument: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlanningService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<PlanningService>(PlanningService);
        prisma = module.get<PrismaService>(PrismaService);

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('findAllTemplates', () => {
        it('should return all system templates when no filters provided', async () => {
            const mockTemplates = [
                { id: '1', type: TemplateType.OIR, name: 'OIR Template', isSystem: true },
                { id: '2', type: TemplateType.PIR, name: 'PIR Template', isSystem: true },
            ];

            mockPrismaService.documentTemplate.findMany.mockResolvedValue(mockTemplates);

            const result = await service.findAllTemplates();

            expect(result).toEqual(mockTemplates);
            expect(prisma.documentTemplate.findMany).toHaveBeenCalledWith({
                where: { isSystem: true },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('should filter templates by type', async () => {
            const mockTemplates = [
                { id: '1', type: TemplateType.OIR, name: 'OIR Template', isSystem: true },
            ];

            mockPrismaService.documentTemplate.findMany.mockResolvedValue(mockTemplates);

            const result = await service.findAllTemplates(TemplateType.OIR);

            expect(result).toEqual(mockTemplates);
            expect(prisma.documentTemplate.findMany).toHaveBeenCalledWith({
                where: { type: TemplateType.OIR, isSystem: true },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('should include organization-specific templates when orgId provided', async () => {
            const mockTemplates = [
                { id: '1', type: TemplateType.OIR, name: 'OIR Template', isSystem: true },
                { id: '2', type: TemplateType.OIR, name: 'Custom OIR', organizationId: 'org-1' },
            ];

            mockPrismaService.documentTemplate.findMany.mockResolvedValue(mockTemplates);

            const result = await service.findAllTemplates(undefined, 'org-1');

            expect(result).toEqual(mockTemplates);
            expect(prisma.documentTemplate.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { isSystem: true },
                        { organizationId: 'org-1' }
                    ]
                },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockPrismaService.documentTemplate.findMany.mockRejectedValue(new Error('DB Error'));

            await expect(service.findAllTemplates()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findTemplateById', () => {
        it('should return template by id', async () => {
            const mockTemplate = { id: '1', type: TemplateType.OIR, name: 'OIR Template' };
            mockPrismaService.documentTemplate.findUnique.mockResolvedValue(mockTemplate);

            const result = await service.findTemplateById('1');

            expect(result).toEqual(mockTemplate);
            expect(prisma.documentTemplate.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should throw NotFoundException when template not found', async () => {
            mockPrismaService.documentTemplate.findUnique.mockResolvedValue(null);

            await expect(service.findTemplateById('invalid-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('createDocument', () => {
        it('should create a new planning document', async () => {
            const createDto = {
                title: 'Test OIR',
                type: TemplateType.OIR,
                content: { sections: [] },
                organizationId: 'org-1',
                projectId: 'proj-1',
            };

            const mockCreatedDoc = {
                id: 'doc-1',
                ...createDto,
                status: DocumentStatus.DRAFT,
                version: '1.0',
                createdBy: 'user-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                project: { name: 'Test Project', code: 'TP' },
            };

            mockPrismaService.planningDocument.create.mockResolvedValue(mockCreatedDoc);

            const result = await service.createDocument('user-1', createDto);

            expect(result).toEqual(mockCreatedDoc);
            expect(prisma.planningDocument.create).toHaveBeenCalledWith({
                data: {
                    title: createDto.title,
                    type: createDto.type,
                    content: createDto.content,
                    status: DocumentStatus.DRAFT,
                    version: '1.0',
                    organizationId: createDto.organizationId,
                    projectId: createDto.projectId,
                    createdBy: 'user-1',
                },
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                }
            });
        });

        it('should throw NotFoundException when organization/project not found (P2003)', async () => {
            const createDto = {
                title: 'Test OIR',
                type: TemplateType.OIR,
                content: {},
                organizationId: 'invalid-org',
            };

            const prismaError: any = new Error('Foreign key constraint');
            prismaError.code = 'P2003';
            mockPrismaService.planningDocument.create.mockRejectedValue(prismaError);

            await expect(service.createDocument('user-1', createDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException on duplicate (P2002)', async () => {
            const createDto = {
                title: 'Test OIR',
                type: TemplateType.OIR,
                content: {},
                organizationId: 'org-1',
            };

            const prismaError: any = new Error('Unique constraint');
            prismaError.code = 'P2002';
            mockPrismaService.planningDocument.create.mockRejectedValue(prismaError);

            await expect(service.createDocument('user-1', createDto)).rejects.toThrow(ConflictException);
        });

        it('should throw InternalServerErrorException on other errors', async () => {
            const createDto = {
                title: 'Test OIR',
                type: TemplateType.OIR,
                content: {},
                organizationId: 'org-1',
            };

            mockPrismaService.planningDocument.create.mockRejectedValue(new Error('Unknown error'));

            await expect(service.createDocument('user-1', createDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAllDocuments', () => {
        it('should return paginated documents', async () => {
            const mockDocuments = [
                { id: 'doc-1', title: 'OIR 1', type: TemplateType.OIR },
                { id: 'doc-2', title: 'PIR 1', type: TemplateType.PIR },
            ];

            mockPrismaService.planningDocument.findMany.mockResolvedValue(mockDocuments);
            mockPrismaService.planningDocument.count.mockResolvedValue(25);

            const result = await service.findAllDocuments('org-1', undefined, undefined, 1, 20);

            expect(result).toEqual({
                data: mockDocuments,
                meta: {
                    page: 1,
                    limit: 20,
                    total: 25,
                    pages: 2,
                },
            });

            expect(prisma.planningDocument.findMany).toHaveBeenCalledWith({
                where: { organizationId: 'org-1' },
                skip: 0,
                take: 20,
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                },
                orderBy: { updatedAt: 'desc' },
            });
        });

        it('should filter by type', async () => {
            mockPrismaService.planningDocument.findMany.mockResolvedValue([]);
            mockPrismaService.planningDocument.count.mockResolvedValue(0);

            await service.findAllDocuments('org-1', undefined, TemplateType.OIR);

            expect(prisma.planningDocument.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { organizationId: 'org-1', type: TemplateType.OIR },
                })
            );
        });

        it('should filter by projectId', async () => {
            mockPrismaService.planningDocument.findMany.mockResolvedValue([]);
            mockPrismaService.planningDocument.count.mockResolvedValue(0);

            await service.findAllDocuments('org-1', 'proj-1');

            expect(prisma.planningDocument.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { organizationId: 'org-1', projectId: 'proj-1' },
                })
            );
        });

        it('should calculate pagination correctly for page 2', async () => {
            mockPrismaService.planningDocument.findMany.mockResolvedValue([]);
            mockPrismaService.planningDocument.count.mockResolvedValue(25);

            await service.findAllDocuments('org-1', undefined, undefined, 2, 10);

            expect(prisma.planningDocument.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    skip: 10, // (2-1) * 10
                    take: 10,
                })
            );
        });
    });

    describe('findOneDocument', () => {
        it('should return document by id', async () => {
            const mockDoc = {
                id: 'doc-1',
                title: 'Test OIR',
                type: TemplateType.OIR,
                project: { name: 'Test Project', code: 'TP' },
            };

            mockPrismaService.planningDocument.findUnique.mockResolvedValue(mockDoc);

            const result = await service.findOneDocument('doc-1');

            expect(result).toEqual(mockDoc);
            expect(prisma.planningDocument.findUnique).toHaveBeenCalledWith({
                where: { id: 'doc-1' },
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                }
            });
        });

        it('should throw NotFoundException when document not found', async () => {
            mockPrismaService.planningDocument.findUnique.mockResolvedValue(null);

            await expect(service.findOneDocument('invalid-id')).rejects.toThrow(NotFoundException);
            await expect(service.findOneDocument('invalid-id')).rejects.toThrow('Document with ID invalid-id not found');
        });
    });

    describe('findLatestOIR', () => {
        it('should return latest published OIR', async () => {
            const mockOIR = {
                id: 'oir-1',
                title: 'Corporate OIR 2025',
                type: TemplateType.OIR,
                status: DocumentStatus.PUBLISHED,
            };

            mockPrismaService.planningDocument.findFirst.mockResolvedValue(mockOIR);

            const result = await service.findLatestOIR('org-1');

            expect(result).toEqual(mockOIR);
            expect(prisma.planningDocument.findFirst).toHaveBeenCalledWith({
                where: {
                    organizationId: 'org-1',
                    type: TemplateType.OIR,
                    status: DocumentStatus.PUBLISHED,
                },
                orderBy: { createdAt: 'desc' },
            });
        });

        it('should return null if no published OIR exists', async () => {
            mockPrismaService.planningDocument.findFirst.mockResolvedValue(null);

            const result = await service.findLatestOIR('org-1');

            expect(result).toBeNull();
        });
    });

    describe('updateDocument', () => {
        it('should update document successfully', async () => {
            const updateDto = {
                title: 'Updated Title',
                content: { updated: true },
                status: DocumentStatus.REVIEW,
            };

            const mockUpdatedDoc = {
                id: 'doc-1',
                ...updateDto,
                project: { name: 'Test Project', code: 'TP' },
            };

            mockPrismaService.planningDocument.update.mockResolvedValue(mockUpdatedDoc);

            const result = await service.updateDocument('doc-1', updateDto);

            expect(result).toEqual(mockUpdatedDoc);
            expect(prisma.planningDocument.update).toHaveBeenCalledWith({
                where: { id: 'doc-1' },
                data: {
                    title: updateDto.title,
                    content: updateDto.content,
                    status: updateDto.status,
                },
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                }
            });
        });

        it('should throw NotFoundException when document not found (P2025)', async () => {
            const updateDto = { title: 'Updated' };

            const prismaError: any = new Error('Record not found');
            prismaError.code = 'P2025';
            mockPrismaService.planningDocument.update.mockRejectedValue(prismaError);

            await expect(service.updateDocument('invalid-id', updateDto)).rejects.toThrow(NotFoundException);
        });

        it('should only update provided fields', async () => {
            const updateDto = { title: 'Updated Title' };

            mockPrismaService.planningDocument.update.mockResolvedValue({
                id: 'doc-1',
                title: 'Updated Title',
            });

            await service.updateDocument('doc-1', updateDto);

            expect(prisma.planningDocument.update).toHaveBeenCalledWith({
                where: { id: 'doc-1' },
                data: {
                    title: 'Updated Title',
                    // content and status should NOT be in data
                },
                include: {
                    project: {
                        select: { name: true, code: true }
                    }
                }
            });
        });
    });

    describe('deleteDocument', () => {
        it('should soft delete document (archive)', async () => {
            mockPrismaService.planningDocument.update.mockResolvedValue({
                id: 'doc-1',
                status: DocumentStatus.ARCHIVED,
            });

            const result = await service.deleteDocument('doc-1');

            expect(result).toEqual({
                success: true,
                message: 'Document archived successfully',
            });

            expect(prisma.planningDocument.update).toHaveBeenCalledWith({
                where: { id: 'doc-1' },
                data: { status: DocumentStatus.ARCHIVED },
            });
        });

        it('should throw NotFoundException when document not found (P2025)', async () => {
            const prismaError: any = new Error('Record not found');
            prismaError.code = 'P2025';
            mockPrismaService.planningDocument.update.mockRejectedValue(prismaError);

            await expect(service.deleteDocument('invalid-id')).rejects.toThrow(NotFoundException);
        });
    });
});
