import { Test, TestingModule } from '@nestjs/testing';
import { PersonnelService } from './personnel.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PersonnelService', () => {
  let service: PersonnelService;

  const mockPrismaService = {
    hsePersonnel: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonnelService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PersonnelService>(PersonnelService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create personnel with documents', async () => {
      const dto = {
        name: 'John Doe',
        company: 'ABC Corp',
        role: 'Operator',
        documents: [{ type: 'SIO', number: 'SIO123', expiry: '2025-12-31' }],
      };

      const mockPersonnel = { id: '1', ...dto };
      mockPrismaService.hsePersonnel.create.mockResolvedValue(mockPersonnel);

      const result = await service.create('project-1', dto);

      expect(result).toEqual(mockPersonnel);
      expect(mockPrismaService.hsePersonnel.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-1',
          name: dto.name,
          company: dto.company,
          role: dto.role,
          documents: dto.documents,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all personnel sorted by name', async () => {
      const mockPersonnel = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];

      mockPrismaService.hsePersonnel.findMany.mockResolvedValue(mockPersonnel);

      const result = await service.findAll('project-1');

      expect(result).toEqual(mockPersonnel);
      expect(mockPrismaService.hsePersonnel.findMany).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('update', () => {
    it('should update personnel data', async () => {
      const dto = { name: 'John Updated' };
      const mockUpdated = { id: '1', ...dto };

      mockPrismaService.hsePersonnel.update.mockResolvedValue(mockUpdated);

      const result = await service.update('1', dto);

      expect(result).toEqual(mockUpdated);
    });
  });

  describe('remove', () => {
    it('should delete personnel', async () => {
      mockPrismaService.hsePersonnel.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result).toEqual({ id: '1' });
      expect(mockPrismaService.hsePersonnel.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
