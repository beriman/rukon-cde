import { Test, TestingModule } from '@nestjs/testing';
import { ClassificationService } from './classification.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ClassificationService', () => {
    let service: ClassificationService;
    let prisma: PrismaService;

    const mockPrisma = {
        classificationAssignment: {
            upsert: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClassificationService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<ClassificationService>(ClassificationService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should search codes correctly', async () => {
        const results = await service.searchCodes('Wall');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].description).toContain('Walls');
    });

    it('should assign codes via upsert', async () => {
        const dto = {
            code: 'Ef_20_10',
            description: 'Walls',
            system: 'Uniclass 2015'
        };

        await service.assignCode('proj-1', 'guid-1', dto);

        expect(mockPrisma.classificationAssignment.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                projectId_elementGuid_system: expect.any(Object)
            })
        }));
    });
});
