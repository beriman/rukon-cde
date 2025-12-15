import { Test, TestingModule } from '@nestjs/testing';
import { HseService } from './hse.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HseService', () => {
  let service: HseService;
  let prisma: PrismaService;

  const mockPrismaService = {
    hseDailyReport: {
      findMany: jest.fn(),
    },
    incident: {
      findMany: jest.fn(),
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

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should calculate total manhours correctly', async () => {
      const mockReports = [
        { date: new Date('2024-01-01'), manhours: 100 },
        { date: new Date('2024-01-02'), manhours: 200 },
        { date: new Date('2024-01-03'), manhours: 300 },
      ];

      mockPrismaService.hseDailyReport.findMany.mockResolvedValue(mockReports);
      mockPrismaService.incident.findMany.mockResolvedValue([]);

      const stats = await service.getStats('project-1');

      expect(stats.totalManhours).toBe(600);
    });

    it('should calculate LTI free days correctly', async () => {
      const today = new Date();
      const tenDaysAgo = new Date(today);
      tenDaysAgo.setDate(today.getDate() - 10);

      mockPrismaService.hseDailyReport.findMany.mockResolvedValue([
        { date: tenDaysAgo, manhours: 100 },
      ]);

      mockPrismaService.incident.findMany.mockResolvedValue([
        { type: 'NEAR_MISS', date: tenDaysAgo },
      ]);

      const stats = await service.getStats('project-1');

      expect(stats.ltiFreeDays).toBeGreaterThanOrEqual(0);
    });

    it('should calculate TRI rate correctly', async () => {
      mockPrismaService.hseDailyReport.findMany.mockResolvedValue([
        { date: new Date(), manhours: 1000000 },
      ]);

      mockPrismaService.incident.findMany.mockResolvedValue([
        { type: 'MTI', date: new Date() },
        { type: 'RWI', date: new Date() },
        { type: 'LTI', date: new Date() },
      ]);

      const stats = await service.getStats('project-1');

      // TRI rate = (recordable incidents / total manhours) * 1,000,000
      // 3 recordable / 1,000,000 * 1,000,000 = 3
      expect(stats.triRate).toBe(3);
    });

    it('should return 0 TRI rate when no manhours', async () => {
      mockPrismaService.hseDailyReport.findMany.mockResolvedValue([]);
      mockPrismaService.incident.findMany.mockResolvedValue([]);

      const stats = await service.getStats('project-1');

      expect(stats.triRate).toBe(0);
    });
  });
});
