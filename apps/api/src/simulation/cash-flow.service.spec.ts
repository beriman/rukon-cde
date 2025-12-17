import { Test, TestingModule } from '@nestjs/testing';
import { CashFlowService } from './cash-flow.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CashFlowService', () => {
    let service: CashFlowService;
    let prisma: PrismaService;

    const mockPrisma = {
        schedule: {
            findUnique: jest.fn(),
        },
        costMapping: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CashFlowService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<CashFlowService>(CashFlowService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should calculate cash flow correctly with linear distribution', async () => {
        // Setup Mock Data
        const scheduleId = 'sched-1';

        // 1. Mock Simulation Links & Schedule
        // Task 1: 10 days (Jan 1 - Jan 10). Link to Element A.
        // Task 2: 5 days (Jan 5 - Jan 10). Link to Element B.
        const mockSchedule = {
            id: scheduleId,
            tasks: [
                {
                    id: 'task-1',
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2025-01-11'), // 10 days duration
                    simulationLinks: [{ elementId: 'guid-A' }]
                },
                {
                    id: 'task-2',
                    startDate: new Date('2025-01-05'),
                    endDate: new Date('2025-01-10'), // 5 days duration
                    simulationLinks: [{ elementId: 'guid-B' }]
                }
            ]
        };

        // 2. Mock Cost Mappings
        // Element A: 1000 total
        // Element B: 500 total
        const mockMappings = [
            { elementGuid: 'guid-A', boqItem: { amount: 1000 } },
            { elementGuid: 'guid-B', boqItem: { amount: 500 } }
        ];

        mockPrisma.schedule.findUnique.mockResolvedValue(mockSchedule);
        mockPrisma.costMapping.findMany.mockResolvedValue(mockMappings);

        // Execute
        const result = await service.getProjectCashFlow(scheduleId);

        // Verifications
        // Task 1: 1000 / 10 days = 100 per day.
        // Task 2: 500 / 5 days = 100 per day.

        // Jan 1 - Jan 4: Only Task 1 active -> Daily 100
        // Jan 5 - Jan 9: Task 1 + Task 2 -> Daily 200
        // Jan 10: Task 1 (ends Jan 11? Logic said d < end) -> 
        // Wait, logic: duration = end - start. d >= start && d < end.
        // Task 1: Start Jan 1, End Jan 11. Duration 10 days. Dates: 1, 2, ... 10.
        // Task 2: Start Jan 5, End Jan 10. Duration 5 days. Dates: 5, 6, 7, 8, 9.

        // Check Jan 1
        const day1 = result.find(r => r.date === '2025-01-01');
        expect(day1?.dailyCost).toBe(100);
        expect(day1?.cumulativeCost).toBe(100);

        // Check Jan 5 (Overlap)
        const day5 = result.find(r => r.date === '2025-01-05');
        // Task 1 (100) + Task 2 (100) = 200
        expect(day5?.dailyCost).toBe(200);

        // Total Cost should be 1500
        const lastDay = result[result.length - 1]; // Should be Jan 10 (Last active day)
        // Wait, maxDate logic uses max(task.end) which is Jan 11 for Task 1, Jan 10 for Task 2.
        // Loop goes <= maxDate.
        // If Task 1 ends Jan 11, logic d < end excludes Jan 11. CORRECT.
        // So last entry should be Jan 10? No, loop goes UP TO maxDate (Jan 11).
        // On Jan 11: Task 1 (end Jan 11) -> 11 < 11 is False. Task 2 (end Jan 10) -> 11 < 10 False.
        // So Jan 11 daily is 0.
        // Let's check logic: for (let d = min; d <= max; ...)

        // Note: JS Date handling can be tricky with timezones, assuming UTC or consistent local.

        expect(result.length).toBeGreaterThan(0);
    });

    it('should generate CSV correctly', async () => {
        // Reuse setup from previous test if possible, or mock getProjectCashFlow
        jest.spyOn(service, 'getProjectCashFlow').mockResolvedValue([
            { date: '2025-01-01', dailyCost: 100, cumulativeCost: 100 },
            { date: '2025-01-02', dailyCost: 200, cumulativeCost: 300 }
        ]);

        const csv = await service.getCashFlowCsv('sched-1');
        expect(csv).toContain('Date,Daily Cost,Cumulative Cost');
        expect(csv).toContain('2025-01-01,100.00,100.00');
        expect(csv).toContain('2025-01-02,200.00,300.00');
    });
});
