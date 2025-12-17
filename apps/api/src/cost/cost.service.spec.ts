import { Test, TestingModule } from '@nestjs/testing';
import { CostService } from './cost.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CostService', () => {
    let service: CostService;
    let prisma: PrismaService;

    const mockPrisma = {
        billOfQuantities: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
        boqItem: {
            createMany: jest.fn(),
            findMany: jest.fn(),
        },
        costMapping: {
            findMany: jest.fn()
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CostService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<CostService>(CostService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should parse CSV and create BoQ Items', async () => {
        const projectId = 'proj-1';
        const csvContent = "Item Code,Description,Unit,Quantity,Rate\nC-01,Concrete,m3,10,1500000";
        const buffer = Buffer.from(csvContent);

        // Mock header creation
        mockPrisma.billOfQuantities.create.mockResolvedValue({ id: 'boq-1', projectId });
        // Mock get details
        mockPrisma.billOfQuantities.findUnique.mockResolvedValue({
            id: 'boq-1',
            items: [{ itemCode: 'C-01', amount: 15000000 }]
        });

        const result = await service.importBoq(projectId, 'Test BoQ', buffer);

        expect(mockPrisma.billOfQuantities.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ projectId, name: 'Test BoQ' })
        }));

        // Expect createMany to be called with parsed data
        expect(mockPrisma.boqItem.createMany).toHaveBeenCalledWith({
            data: expect.arrayContaining([
                expect.objectContaining({
                    itemCode: 'C-01',
                    unit: 'm3',
                    quantity: 10,
                    unitRate: 1500000,
                    amount: 15000000 // 10 * 1.5m
                })
            ])
        });
    });
});
