import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { PrismaService } from '../prisma/prisma.service';
import { Discipline } from '@prisma/client';

describe('ProgressService', () => {
    let service: ProgressService;
    let prisma: PrismaService;

    const mockPrismaService = {
        workPackage: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
        progressUpdate: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProgressService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ProgressService>(ProgressService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createWorkPackage', () => {
        it('should create a work package', async () => {
            const dto = {
                projectId: 'proj-1',
                name: 'Zone A',
                discipline: Discipline.STRUCT,
                weight: 2.0,
            };

            mockPrismaService.workPackage.create.mockResolvedValue({ id: 'wp-1', ...dto });

            const result = await service.createWorkPackage(dto);
            expect(result).toEqual({ id: 'wp-1', ...dto });
            expect(prisma.workPackage.create).toHaveBeenCalledWith({
                data: {
                    projectId: 'proj-1',
                    name: 'Zone A',
                    discipline: Discipline.STRUCT,
                    weight: 2.0,
                },
            });
        });
    });

    describe('recordProgress', () => {
        it('should calculate weighted progress correctly', async () => {
            // This is strictly testing calculation logic if we were to test getProjectProgress
            // Ideally we mock the DB return values first
        });
    });
});
