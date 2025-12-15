import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { PlanningModule } from '../src/planning/planning.module';
import { TemplateType, DocumentStatus } from '@prisma/client';
import * as request from 'supertest';

describe('Planning Module Integration Tests (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    // Test data that will be cleaned up
    const testOrgId = 'test-org-integration';
    const testProjectId = 'test-project-integration';
    let createdTemplateId: string;
    let createdOIRId: string;
    let createdPIRId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PlanningModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);

        // Setup test organization and project
        await prisma.organization.create({
            data: {
                id: testOrgId,
                name: 'Test Integration Org',
                slug: 'test-integration-org',
            },
        });

        await prisma.project.create({
            data: {
                id: testProjectId,
                name: 'Test Integration Project',
                code: 'TIP-001',
                organizationId: testOrgId,
            },
        });
    });

    afterAll(async () => {
        // Cleanup: Delete created documents, then project, then organization
        await prisma.planningDocument.deleteMany({
            where: { organizationId: testOrgId },
        });

        await prisma.project.deleteMany({
            where: { id: testProjectId },
        });

        await prisma.organization.deleteMany({
            where: { id: testOrgId },
        });

        // Cleanup test templates if created
        if (createdTemplateId) {
            await prisma.documentTemplate.deleteMany({
                where: { id: createdTemplateId },
            });
        }

        await app.close();
    });

    describe('Template Management Flow', () => {
        it('should fetch system templates', async () => {
            const response = await request(app.getHttpServer())
                .get('/planning/templates')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            // System templates should exist (from seed)
            // If seed hasn't run, this will be empty array (acceptable for test)
        });

        it('should filter templates by type', async () => {
            const response = await request(app.getHttpServer())
                .get('/planning/templates?type=OIR')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            // All returned templates should be OIR type
            response.body.forEach((template: any) => {
                expect(template.type).toBe(TemplateType.OIR);
            });
        });

        it('should fetch template by id (if exists)', async () => {
            // First, get all templates
            const templatesResponse = await request(app.getHttpServer())
                .get('/planning/templates')
                .expect(200);

            if (templatesResponse.body.length > 0) {
                const templateId = templatesResponse.body[0].id;

                const response = await request(app.getHttpServer())
                    .get(`/planning/templates/${templateId}`)
                    .expect(200);

                expect(response.body).toHaveProperty('id', templateId);
                expect(response.body).toHaveProperty('type');
                expect(response.body).toHaveProperty('content');
            }
        });
    });

    describe('Document Creation Flow', () => {
        it('should create an OIR document', async () => {
            const createDto = {
                title: 'Test Corporate OIR 2025',
                type: TemplateType.OIR,
                content: {
                    sections: [
                        {
                            id: 'strategic_objectives',
                            title: 'Strategic Objectives',
                            content: 'Digital transformation and sustainability',
                        },
                    ],
                },
                organizationId: testOrgId,
            };

            const response = await request(app.getHttpServer())
                .post('/planning/documents')
                .send(createDto)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(createDto.title);
            expect(response.body.type).toBe(TemplateType.OIR);
            expect(response.body.status).toBe(DocumentStatus.DRAFT);
            expect(response.body.version).toBe('1.0');

            createdOIRId = response.body.id;
        });

        it('should retrieve the created OIR document', async () => {
            const response = await request(app.getHttpServer())
                .get(`/planning/documents/${createdOIRId}`)
                .expect(200);

            expect(response.body.id).toBe(createdOIRId);
            expect(response.body.title).toBe('Test Corporate OIR 2025');
            expect(response.body.type).toBe(TemplateType.OIR);
        });

        it('should update the OIR document', async () => {
            const updateDto = {
                title: 'Updated Corporate OIR 2025',
                status: DocumentStatus.REVIEW,
            };

            const response = await request(app.getHttpServer())
                .patch(`/planning/documents/${createdOIRId}`)
                .send(updateDto)
                .expect(200);

            expect(response.body.title).toBe(updateDto.title);
            expect(response.body.status).toBe(DocumentStatus.REVIEW);
        });

        it('should publish the OIR document', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/planning/documents/${createdOIRId}`)
                .send({ status: DocumentStatus.PUBLISHED })
                .expect(200);

            expect(response.body.status).toBe(DocumentStatus.PUBLISHED);
        });
    });

    describe('OIR → PIR Linkage Flow', () => {
        it('should retrieve latest published OIR', async () => {
            const response = await request(app.getHttpServer())
                .get(`/planning/latest-oir?orgId=${testOrgId}`)
                .expect(200);

            // Should return the OIR we published
            expect(response.body).toBeDefined();
            if (response.body) {
                expect(response.body.type).toBe(TemplateType.OIR);
                expect(response.body.status).toBe(DocumentStatus.PUBLISHED);
            }
        });

        it('should create PIR linked to project', async () => {
            const createDto = {
                title: 'Test Project PIR',
                type: TemplateType.PIR,
                content: {
                    sections: [
                        {
                            id: 'project_overview',
                            title: 'Project Overview',
                            content: 'High-rise residential building project',
                        },
                        {
                            id: 'key_decision_points',
                            title: 'Key Decision Points',
                            content: [
                                { stage: 'Concept', question: 'Is design feasible?' },
                                { stage: 'Technical', question: 'Does design comply?' },
                            ],
                        },
                    ],
                },
                organizationId: testOrgId,
                projectId: testProjectId,
            };

            const response = await request(app.getHttpServer())
                .post('/planning/documents')
                .send(createDto)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.type).toBe(TemplateType.PIR);
            expect(response.body.projectId).toBe(testProjectId);
            expect(response.body.project).toBeDefined();
            expect(response.body.project.name).toBe('Test Integration Project');

            createdPIRId = response.body.id;
        });

        it('should fetch all documents for organization', async () => {
            const response = await request(app.getHttpServer())
                .get(`/planning/documents?orgId=${testOrgId}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThanOrEqual(2); // OIR + PIR

            // Verify metadata
            expect(response.body.meta).toHaveProperty('page');
            expect(response.body.meta).toHaveProperty('limit');
            expect(response.body.meta).toHaveProperty('total');
            expect(response.body.meta).toHaveProperty('pages');
        });

        it('should filter documents by project', async () => {
            const response = await request(app.getHttpServer())
                .get(`/planning/documents?orgId=${testOrgId}&projectId=${testProjectId}`)
                .expect(200);

            expect(response.body.data).toBeDefined();
            // PIR should be in results, OIR should not (OIR has no projectId)
            const pirDoc = response.body.data.find((d: any) => d.type === TemplateType.PIR);
            expect(pirDoc).toBeDefined();
        });

        it('should filter documents by type', async () => {
            const response = await request(app.getHttpServer())
                .get(`/planning/documents?orgId=${testOrgId}&type=OIR`)
                .expect(200);

            expect(response.body.data).toBeDefined();
            response.body.data.forEach((doc: any) => {
                expect(doc.type).toBe(TemplateType.OIR);
            });
        });
    });

    describe('Pagination Flow', () => {
        it('should paginate documents correctly', async () => {
            // Page 1
            const page1Response = await request(app.getHttpServer())
                .get(`/planning/documents?orgId=${testOrgId}&page=1&limit=1`)
                .expect(200);

            expect(page1Response.body.data.length).toBeLessThanOrEqual(1);
            expect(page1Response.body.meta.page).toBe(1);
            expect(page1Response.body.meta.limit).toBe(1);

            // Page 2
            const page2Response = await request(app.getHttpServer())
                .get(`/planning/documents?orgId=${testOrgId}&page=2&limit=1`)
                .expect(200);

            expect(page2Response.body.meta.page).toBe(2);

            // Documents on page 1 and page 2 should be different
            if (page1Response.body.data.length > 0 && page2Response.body.data.length > 0) {
                expect(page1Response.body.data[0].id).not.toBe(page2Response.body.data[0].id);
            }
        });
    });

    describe('Document Lifecycle Flow', () => {
        it('should transition document through lifecycle states', async () => {
            // Create new AIR document
            const createDto = {
                title: 'Test AIR Document',
                type: TemplateType.AIR,
                content: { assets: [] },
                organizationId: testOrgId,
            };

            const createResponse = await request(app.getHttpServer())
                .post('/planning/documents')
                .send(createDto)
                .expect(201);

            const airId = createResponse.body.id;

            // DRAFT → REVIEW
            await request(app.getHttpServer())
                .patch(`/planning/documents/${airId}`)
                .send({ status: DocumentStatus.REVIEW })
                .expect(200);

            // REVIEW → APPROVED
            await request(app.getHttpServer())
                .patch(`/planning/documents/${airId}`)
                .send({ status: DocumentStatus.APPROVED })
                .expect(200);

            // APPROVED → PUBLISHED
            await request(app.getHttpServer())
                .patch(`/planning/documents/${airId}`)
                .send({ status: DocumentStatus.PUBLISHED })
                .expect(200);

            // Verify final state
            const finalResponse = await request(app.getHttpServer())
                .get(`/planning/documents/${airId}`)
                .expect(200);

            expect(finalResponse.body.status).toBe(DocumentStatus.PUBLISHED);
        });
    });

    describe('Soft Delete Flow', () => {
        it('should archive document instead of hard delete', async () => {
            // Create document to delete
            const createDto = {
                title: 'Document to Delete',
                type: TemplateType.EIR,
                content: {},
                organizationId: testOrgId,
            };

            const createResponse = await request(app.getHttpServer())
                .post('/planning/documents')
                .send(createDto)
                .expect(201);

            const docId = createResponse.body.id;

            // Delete (archive) the document
            const deleteResponse = await request(app.getHttpServer())
                .delete(`/planning/documents/${docId}`)
                .expect(200);

            expect(deleteResponse.body.success).toBe(true);

            // Document should still exist but with ARCHIVED status
            const archivedDoc = await prisma.planningDocument.findUnique({
                where: { id: docId },
            });

            expect(archivedDoc).toBeDefined();
            expect(archivedDoc?.status).toBe(DocumentStatus.ARCHIVED);
        });
    });

    describe('Error Handling Flow', () => {
        it('should return 404 for non-existent document', async () => {
            await request(app.getHttpServer())
                .get('/planning/documents/non-existent-id')
                .expect(404);
        });

        it('should return 404 when updating non-existent document', async () => {
            await request(app.getHttpServer())
                .patch('/planning/documents/non-existent-id')
                .send({ title: 'New Title' })
                .expect(404);
        });

        it('should return 404 when deleting non-existent document', async () => {
            await request(app.getHttpServer())
                .delete('/planning/documents/non-existent-id')
                .expect(404);
        });

        it('should validate required fields on create', async () => {
            const invalidDto = {
                // Missing title
                type: TemplateType.OIR,
                content: {},
                organizationId: testOrgId,
            };

            await request(app.getHttpServer())
                .post('/planning/documents')
                .send(invalidDto)
                .expect(400);
        });
    });
});
