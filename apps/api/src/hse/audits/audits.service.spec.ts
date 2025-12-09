import { Test, TestingModule } from '@nestjs/testing';
import { AuditsService } from './audits.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuditsService', () => {
  let service: AuditsService;

  const mockPrismaService = {
    hseAudit: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    hseAuditFinding: {
      update: jest.fn(),
    },
    hseEmergencyContact: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuditsService>(AuditsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAudit', () => {
    it('should create audit with findings', async () => {
      const dto = {
        auditDate: '2024-01-01',
        auditor: 'Auditor Name',
        scope: 'ISO 9001',
        findings: [
          { clause: '4.1', severity: 'MAJOR' as const, description: 'Finding 1' },
        ],
      };

      const mockAudit = { id: '1', ...dto, findings: [] };
      mockPrismaService.hseAudit.create.mockResolvedValue(mockAudit);

      const result = await service.createAudit('project-1', dto);

      expect(result).toEqual(mockAudit);
    });
  });

  describe('updateFinding', () => {
    it('should update finding status', async () => {
      const dto = { status: 'CLOSED' as const, closureEvidence: 'Fixed' };
      const mockFinding = { id: '1', ...dto };

      mockPrismaService.hseAuditFinding.update.mockResolvedValue(mockFinding);

      const result = await service.updateFinding('1', dto);

      expect(result).toEqual(mockFinding);
    });
  });

  describe('createContact', () => {
    it('should create emergency contact', async () => {
      const dto = {
        name: 'Emergency Contact',
        role: 'Safety Manager',
        phone: '+628123456789',
        isPrimary: true,
      };

      const mockContact = { id: '1', ...dto };
      mockPrismaService.hseEmergencyContact.create.mockResolvedValue(mockContact);

      const result = await service.createContact('project-1', dto);

      expect(result).toEqual(mockContact);
    });
  });

  describe('findAllContacts', () => {
    it('should return contacts sorted by primary first', async () => {
      const mockContacts = [
        { id: '1', name: 'Primary', isPrimary: true },
        { id: '2', name: 'Secondary', isPrimary: false },
      ];

      mockPrismaService.hseEmergencyContact.findMany.mockResolvedValue(mockContacts);

      const result = await service.findAllContacts('project-1');

      expect(result).toEqual(mockContacts);
      expect(mockPrismaService.hseEmergencyContact.findMany).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
        orderBy: [{ isPrimary: 'desc' }, { name: 'asc' }],
      });
    });
  });
});
