import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from './sync.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
    project: {
        findFirst: jest.fn(),
    },
    file: {
        findMany: jest.fn(),
    },
    taskDeliverable: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
};

describe('SyncService', () => {
    let service: SyncService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SyncService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<SyncService>(SyncService);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('pullChanges', () => {
        it('should query models with correct timestamp filter', async () => {
            const lastSync = new Date('2024-01-01');
            const projectId = 'proj-1';
            const userId = 'user-1';

            await service.pullChanges(projectId, lastSync, userId);

            expect(prisma.project.findFirst).toHaveBeenCalledWith({
                where: { id: projectId, updatedAt: { gt: lastSync } },
            });
            expect(prisma.file.findMany).toHaveBeenCalledWith({
                where: {
                    folder: { projectId },
                    updatedAt: { gt: lastSync }
                },
                orderBy: { updatedAt: 'asc' },
            });
        });
    });

    describe('pushChanges', () => {
        it('should detect conflicts if server version is newer', async () => {
            const projectId = 'proj-1';
            const userId = 'user-1';
            const changes = {
                taskDeliverables: [
                    {
                        id: 'td-1',
                        lastServerSync: '2024-01-01T00:00:00Z',
                        data: { status: 'COMPLETED' },
                    },
                ],
            };

            // Update: Mock findMany instead of findUnique
            mockPrismaService.taskDeliverable.findMany.mockResolvedValue([
                {
                    id: 'td-1',
                    updatedAt: new Date('2024-01-02'), // Newer
                }
            ]);

            const result = await service.pushChanges(projectId, changes, userId);

            expect(result.conflicts).toHaveLength(1);
            expect(result.conflicts[0].id).toBe('td-1');
            expect(prisma.taskDeliverable.update).not.toHaveBeenCalled();
        });

        it('should apply updates if no conflict', async () => {
            const projectId = 'proj-1';
            const userId = 'user-1';
            const changes = {
                taskDeliverables: [
                    {
                        id: 'td-2',
                        lastServerSync: '2024-01-01T00:00:00Z',
                        data: { status: 'COMPLETED' },
                    },
                ],
            };

            // Update: Mock findMany instead of findUnique
             mockPrismaService.taskDeliverable.findMany.mockResolvedValue([
                {
                    id: 'td-2',
                    updatedAt: new Date('2023-12-31'), // Older
                }
            ]);
            mockPrismaService.taskDeliverable.update.mockResolvedValue({ id: 'td-2' });

            const result = await service.pushChanges(projectId, changes, userId);

            expect(result.applied).toHaveLength(1);
            expect(prisma.taskDeliverable.update).toHaveBeenCalled();
        });
    });
});
