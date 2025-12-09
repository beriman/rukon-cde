import { Test, TestingModule } from '@nestjs/testing';
import { HseService } from './hse.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HseService', () => {
  let service: HseService;
  let prisma: PrismaService;

  const mockPrismaService = {
    hseDailyReport: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    incident: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HseService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HseService>(HseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should calculate total manhours correctly', async () => {
      const mockReports = [
        { manhours: 100 },
        { manhours: 200 },
        { manhours: 300 },
      ];

      mockPrismaService.hseDailyReport.aggregate.mockResolvedValue({
        _sum: { manhours: 600 },
      });

      mockPrismaService.hseDailyReport.findMany.mockResolvedValue([
        { date: new Date('2024-01-01'), manhours: 100 },
        { date: new Date('2024-01-02'), manhours: 200 },
      ]);

      mockPrismaService.incident.findMany.mockResolvedValue([]);
      mockPrismaService.incident.count.mockResolvedValue(0);

      const stats = await service.getStats('project-1');

      expect(stats.totalManhours).toBe(600);
      expect(mockPrismaService.hseDailyReport.aggregate).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
        _sum: { manhours: true },
      });
    });

    it('should calculate LTI free days correctly', async () => {
      const today = new Date();
      const tenDaysAgo = new Date(today);
      tenDaysAgo.setDate(today.getDate() - 10);

      mockPrismaService.hseDailyReport.aggregate.mockResolvedValue({
        _sum: { manhours: 1000 },
      });

      mockPrismaService.hseDailyReport.findMany.mockResolvedValue([
        { date: tenDaysAgo, manhours: 100 },
      ]);

      mockPrismaService.incident.findMany.mockResolvedValue([
        { type: 'NEAR_MISS', date: tenDaysAgo },
      ]);

      mockPrismaService.incident.count.mockResolvedValue(1);

      const stats = await service.getStats('project-1');

      expect(stats.ltiFreeDays).toBeGreaterThanOrEqual(10);
    });

    it('should calculate TRI rate correctly', async () => {
      mockPrismaService.hseDailyReport.aggregate.mockResolvedValue({
        _sum: { manhours: 1000000 },
      });

      mockPrismaService.hseDailyReport.findMany.mockResolvedValue([]);

      mockPrismaService.incident.findMany.mockResolvedValue([
        { type: 'MTI' },
        { type: 'RWI' },
        { type: 'LTI' },
      ]);

      mockPrismaService.incident.count.mockResolvedValue(5);

      const stats = await service.getStats('project-1');

      // TRI rate = (recordable incidents / total manhours) * 1,000,000
      // 3 recordable / 1,000,000 * 1,000,000 = 3
      expect(stats.triRate).toBe(3);
    });

    it('should return 0 TRI rate when no manhours', async () => {
      mockPrismaService.hseDailyReport.aggregate.mockResolvedValue({
        _sum: { manhours: 0 },
      });

      mockPrismaService.hseDailyReport.findMany.mockResolvedValue([]);
      mockPrismaService.incident.findMany.mockResolvedValue([]);
      mockPrismaService.incident.count.mockResolvedValue(0);

      const stats = await service.getStats('project-1');

      expect(stats.triRate).toBe(0);
    });
  });
});
