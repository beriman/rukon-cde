import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    incident: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    incidentAction: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new incident', async () => {
      const dto = {
        type: 'NEAR_MISS' as const,
        severity: 'LOW' as const,
        date: '2024-01-01T00:00:00.000Z',
        location: 'Site A',
        description: 'Description of incident',
        witnesses: ['John Doe'],
        photos: [],
      };

      const mockIncident = {
        id: '1',
        ...dto,
        date: new Date(dto.date),
        status: 'OPEN',
        reporter: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      };

      mockPrismaService.incident.create.mockResolvedValue(mockIncident);

      const result = await service.create('project-1', 'user-1', dto);

      expect(result).toEqual(mockIncident);
      expect(mockPrismaService.incident.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-1',
          reportedBy: 'user-1',
          type: dto.type,
          severity: dto.severity,
          date: new Date(dto.date),
          location: dto.location,
          description: dto.description,
          witnesses: dto.witnesses,
          photos: [],
          status: 'OPEN',
        },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated incidents', async () => {
      const mockIncidents = [
        { id: '1', type: 'NEAR_MISS' },
        { id: '2', type: 'LTI' },
      ];

      mockPrismaService.incident.findMany.mockResolvedValue(mockIncidents);
      mockPrismaService.incident.count.mockResolvedValue(2);

      const result = await service.findAll('project-1', 1, 20);

      expect(result.data).toEqual(mockIncidents);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should calculate pagination correctly', async () => {
      mockPrismaService.incident.findMany.mockResolvedValue([]);
      mockPrismaService.incident.count.mockResolvedValue(45);

      const result = await service.findAll('project-1', 2, 20);

      expect(result.meta.totalPages).toBe(3); // 45 items / 20 per page = 3 pages
      expect(mockPrismaService.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20, // page 2, skip first 20
          take: 20,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an incident by ID', async () => {
      const mockIncident = { id: '1', type: 'NEAR_MISS' };
      mockPrismaService.incident.findUnique.mockResolvedValue(mockIncident);

      const result = await service.findOne('1');

      expect(result).toEqual(mockIncident);
    });

    it('should throw NotFoundException when incident not found', async () => {
      mockPrismaService.incident.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addAction', () => {
    it('should create a corrective action', async () => {
      const dto = {
        description: 'Fix the issue',
        assigneeId: 'user-1',
        dueDate: '2024-12-31T00:00:00.000Z',
      };

      const mockAction = {
        id: 'action-1',
        ...dto,
        dueDate: new Date(dto.dueDate),
        status: 'OPEN',
      };

      mockPrismaService.incidentAction.create.mockResolvedValue(mockAction);

      const result = await service.addAction('incident-1', dto);

      expect(result).toEqual(mockAction);
      expect(mockPrismaService.incidentAction.create).toHaveBeenCalledWith({
        data: {
          incidentId: 'incident-1',
          description: dto.description,
          assigneeId: dto.assigneeId,
          dueDate: new Date(dto.dueDate),
          status: 'OPEN',
        },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      });
    });
  });

  describe('updateAction', () => {
    it('should update action status to COMPLETED and set completedAt', async () => {
      const mockAction = {
        id: 'action-1',
        status: 'COMPLETED',
        completedAt: expect.any(Date),
      };

      mockPrismaService.incidentAction.update.mockResolvedValue(mockAction);

      const result = await service.updateAction('action-1', 'COMPLETED');

      expect(result).toEqual(mockAction);
      expect(mockPrismaService.incidentAction.update).toHaveBeenCalledWith({
        where: { id: 'action-1' },
        data: {
          status: 'COMPLETED',
          completedAt: expect.any(Date),
        },
      });
    });

    it('should not set completedAt for IN_PROGRESS status', async () => {
      mockPrismaService.incidentAction.update.mockResolvedValue({
        id: 'action-1',
        status: 'IN_PROGRESS',
        completedAt: null,
      });

      await service.updateAction('action-1', 'IN_PROGRESS');

      expect(mockPrismaService.incidentAction.update).toHaveBeenCalledWith({
        where: { id: 'action-1' },
        data: {
          status: 'IN_PROGRESS',
          completedAt: null,
        },
      });
    });
  });
});
