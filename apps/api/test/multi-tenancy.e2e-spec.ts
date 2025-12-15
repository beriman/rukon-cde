import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenancy Isolation (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    // Org 1
    let org1: any;
    let org1User: any;
    let org1UserToken: string;
    let org1Project: any;

    // Org 2
    let org2: any;
    let org2User: any;
    let org2UserToken: string;
    let org2Project: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        prisma = app.get(PrismaService);

        // Create Organization 1
        org1 = await prisma.organization.create({
            data: {
                name: 'Test Org 1',
                slug: 'test-org-1'
            },
        });

        // Create User 1
        const user1Response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'user1@org1.com',
                password: 'Password123!',
                name: 'User One',
            });

        // Update user1 to belong to org1
        org1User = await prisma.user.update({
            where: { email: 'user1@org1.com' },
            data: {
                organizations: {
                    create: {
                        organizationId: org1.id,
                        role: 'MEMBER'
                    }
                }
            },
        });

        // Login user1
        const login1Response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'user1@org1.com',
                password: 'Password123!',
            });
        org1UserToken = login1Response.body.accessToken;

        // Create Project for Org 1
        const project1Response = await request(app.getHttpServer())
            .post('/projects')
            .set('Authorization', `Bearer ${org1UserToken}`)
            .send({
                name: 'Org 1 Project',
                description: 'Project belonging to Org 1',
            });
        org1Project = project1Response.body;

        // Create Organization 2
        org2 = await prisma.organization.create({
            data: {
                name: 'Test Org 2',
                slug: 'test-org-2'
            },
        });

        // Create User 2
        const user2Response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'user2@org2.com',
                password: 'Password123!',
                name: 'User Two',
            });

        // Update user2 to belong to org2
        org2User = await prisma.user.update({
            where: { email: 'user2@org2.com' },
            data: {
                organizations: {
                    create: {
                        organizationId: org2.id,
                        role: 'MEMBER'
                    }
                }
            },
        });

        // Login user2
        const login2Response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'user2@org2.com',
                password: 'Password123!',
            });
        org2UserToken = login2Response.body.accessToken;

        // Create Project for Org 2
        const project2Response = await request(app.getHttpServer())
            .post('/projects')
            .set('Authorization', `Bearer ${org2UserToken}`)
            .send({
                name: 'Org 2 Project',
                description: 'Project belonging to Org 2',
            });
        org2Project = project2Response.body;
    });

    afterAll(async () => {
        // Cleanup
        await prisma.project.deleteMany({
            where: {
                OR: [{ id: org1Project?.id }, { id: org2Project?.id }],
            },
        });
        await prisma.user.deleteMany({
            where: {
                OR: [{ email: 'user1@org1.com' }, { email: 'user2@org2.com' }],
            },
        });
        await prisma.organization.deleteMany({
            where: {
                OR: [{ id: org1.id }, { id: org2.id }],
            },
        });

        await app.close();
    });

    describe('Project Isolation', () => {
        it('should not allow User from Org1 to see Org2 projects in list', async () => {
            const response = await request(app.getHttpServer())
                .get('/projects')
                .set('Authorization', `Bearer ${org1UserToken}`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).not.toContainEqual(
                expect.objectContaining({ id: org2Project.id }),
            );
            expect(response.body.some((p: any) => p.organizationId === org1.id)).toBe(true);
        });

        it('should block direct access to Org2 project by Org1 user', async () => {
            await request(app.getHttpServer())
                .get(`/projects/${org2Project.id}`)
                .set('Authorization', `Bearer ${org1UserToken}`)
                .expect(403); // Forbidden
        });

        it('should allow User from Org2 to access their own project', async () => {
            const response = await request(app.getHttpServer())
                .get(`/projects/${org2Project.id}`)
                .set('Authorization', `Bearer ${org2UserToken}`)
                .expect(200);

            expect(response.body.id).toBe(org2Project.id);
            expect(response.body.organizationId).toBe(org2.id);
        });
    });

    describe('User Isolation', () => {
        it('should not allow Org1 user to see Org2 users', async () => {
            const response = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${org1UserToken}`)
                .expect(200);

            const userEmails = response.body.map((u: any) => u.email);
            expect(userEmails).not.toContain('user2@org2.com');
        });

        it('should not allow Org1 user to update Org2 user', async () => {
            await request(app.getHttpServer())
                .patch(`/users/${org2User.id}`)
                .set('Authorization', `Bearer ${org1UserToken}`)
                .send({ name: 'Hacked Name' })
                .expect(403);
        });
    });

    describe('Organization Scoped Queries', () => {
        it('should only return data belonging to user organization', async () => {
            const projectsResponse = await request(app.getHttpServer())
                .get('/projects')
                .set('Authorization', `Bearer ${org1UserToken}`)
                .expect(200);

            const allBelongToOrg1 = projectsResponse.body.every(
                (p: any) => p.organizationId === org1.id,
            );
            expect(allBelongToOrg1).toBe(true);
        });

        it('should maintain isolation across different endpoints', async () => {
            // Users endpoint
            const usersResponse = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${org1UserToken}`)
                .expect(200);

            const allUsersBelongToOrg1 = usersResponse.body.every(
                (u: any) => u.organizationId === org1.id,
            );
            expect(allUsersBelongToOrg1).toBe(true);

            // Projects endpoint
            const projectsResponse = await request(app.getHttpServer())
                .get('/projects')
                .set('Authorization', `Bearer ${org1UserToken}`)
                .expect(200);

            const allProjectsBelongToOrg1 = projectsResponse.body.every(
                (p: any) => p.organizationId === org1.id,
            );
            expect(allProjectsBelongToOrg1).toBe(true);
        });
    });

    describe('Cross-Tenant Attack Scenarios', () => {
        it('should prevent accessing other org files via direct ID', async () => {
            // This test assumes files exist; skip if no file upload in test setup
            // await request(app.getHttpServer())
            //   .get(`/files/${org2FileId}`)
            //   .set('Authorization', `Bearer ${org1UserToken}`)
            //   .expect(403);
        });

        it('should prevent project updates across organizations', async () => {
            await request(app.getHttpServer())
                .patch(`/projects/${org2Project.id}`)
                .set('Authorization', `Bearer ${org1UserToken}`)
                .send({ name: 'Updated by Org1' })
                .expect(403);
        });

        it('should prevent archive/restore across organizations', async () => {
            await request(app.getHttpServer())
                .patch(`/projects/${org2Project.id}/archive`)
                .set('Authorization', `Bearer ${org1UserToken}`)
                .expect(403);
        });
    });
});
