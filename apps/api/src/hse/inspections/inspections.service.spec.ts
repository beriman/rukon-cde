import { Test, TestingModule } from '@nestjs/testing';
import { InspectionsService } from './inspections.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('InspectionsService', () => {
  let service: InspectionsService;

  const mockPrismaService = {
    inspectionForm: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InspectionsService>(InspectionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create inspection with items', async () => {
      const dto = {
        type: 'EXCAVATOR' as const,
        date: '2024-01-01',
        items: [
          { question: 'Check fuel', result: 'PASS' as const },
          { question: 'Check brakes', result: 'FAIL' as const, comment: 'Needs repair' },
        ],
      };

      const mockInspection = {
        id: '1',
        ...dto,
        items: dto.items,
        inspector: { id: 'user-1', name: 'Inspector' },
      };

      mockPrismaService.inspectionForm.create.mockResolvedValue(mockInspection);

      const result = await service.create('project-1', 'user-1', dto);

      expect(result).toEqual(mockInspection);
      expect(mockPrismaService.inspectionForm.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-1',
          inspectorId: 'user-1',
          type: dto.type,
          date: new Date(dto.date),
          items: {
            create: dto.items,
          },
        },
        include: {
          items: true,
          inspector: { select: { id: true, name: true, email: true } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return inspections ordered by date desc', async () => {
      const mockInspections = [
        { id: '1', type: 'CRANE', date: new Date('2024-01-02') },
        { id: '2', type: 'EXCAVATOR', date: new Date('2024-01-01') },
      ];

      mockPrismaService.inspectionForm.findMany.mockResolvedValue(mockInspections);

      const result = await service.findAll('project-1');

      expect(result).toEqual(mockInspections);
      expect(mockPrismaService.inspectionForm.findMany).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
        include: {
          items: true,
          inspector: { select: { id: true, name: true, email: true } },
        },
        orderBy: { date: 'desc' },
      });
    });
  });
});
