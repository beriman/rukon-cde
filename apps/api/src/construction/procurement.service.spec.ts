import { Test, TestingModule } from '@nestjs/testing';
import { ProcurementService } from './procurement.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProcurementService', () => {
    let service: ProcurementService;
    let prisma: PrismaService;

    const mockPrismaService = {
        procurementItem: {
            create: jest.fn(),
            createMany: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        billOfQuantities: {
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        boQItem: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProcurementService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ProcurementService>(ProcurementService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getBQSummary', () => {
        it('should calculate BQ summary correctly', async () => {
            const mockItems = [
                { itemCode: 'A', quantity: 100, actualQty: 90, unitRate: 10 },
                { itemCode: 'B', quantity: 50, actualQty: 60, unitRate: 20 },
            ];

            mockPrismaService.boQItem.findMany.mockResolvedValue(mockItems);

            const result = await service.getBQSummary('proj-1');

            expect(result.totalPlanned).toBe(2000); // (100*10) + (50*20)
            expect(result.totalActual).toBe(2100); // (90*10) + (60*20)
            expect(result.variance).toBe(100);
            expect(result.variancePercent).toBe(5); // (100/2000)*100
            expect(result.itemCount).toBe(2);
        });
    });
});
