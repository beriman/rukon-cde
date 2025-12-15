import { Test, TestingModule } from '@nestjs/testing';
import { SmartReviewService } from './smart-review.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
    validationRule: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
    validationReport: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
};

describe('SmartReviewService', () => {
    let service: SmartReviewService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SmartReviewService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<SmartReviewService>(SmartReviewService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createRule', () => {
        it('should create a validation rule', async () => {
            const dto = { name: 'Test Rule', category: 'Testing', ruleType: 'REGEX' as const, config: {} };
            mockPrismaService.validationRule.create.mockResolvedValue({ id: '1', ...dto });

            const result = await service.createRule(dto);
            expect(result).toEqual({ id: '1', ...dto });
            expect(prisma.validationRule.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ name: 'Test Rule' }),
            });
        });
    });

    describe('getRules', () => {
        it('should return active rules', async () => {
            mockPrismaService.validationRule.findMany.mockResolvedValue([{ id: '1', name: 'Rule 1' }]);
            const result = await service.getRules();
            expect(result).toHaveLength(1);
            expect(prisma.validationRule.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
        });
    });

    describe('createReport', () => {
        it('should create a validation report', async () => {
            const dto = { projectId: 'p1', modelId: 'm1', result: {}, score: 100 };
            mockPrismaService.validationReport.create.mockResolvedValue({ id: 'r1', ...dto });

            const result = await service.createReport(dto);
            expect(result).toEqual({ id: 'r1', ...dto });
        });
    });
});
