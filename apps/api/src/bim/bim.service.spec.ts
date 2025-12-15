import { Test, TestingModule } from '@nestjs/testing';
import { BimService } from './bim.service';
import { FilesService } from '../files/files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BimService', () => {
  let service: BimService;

  const mockFilesService = {
    findOne: jest.fn(),
    generateDownloadUrl: jest.fn(),
  };

  const mockPrismaService = {
    folder: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BimService,
        { provide: FilesService, useValue: mockFilesService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BimService>(BimService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccessToken', () => {
    it('should generate token for valid file in project', async () => {
      const projectId = 'p1';
      const fileId = 'f1';
      const folderId = 'folder1';

      mockFilesService.findOne.mockResolvedValue({ id: fileId, folderId });
      mockPrismaService.folder.findUnique.mockResolvedValue({ id: folderId, projectId });
      mockFilesService.generateDownloadUrl.mockResolvedValue({
        url: 'http://s3/file',
        expiresIn: 300
      });

      const result = await service.getAccessToken(projectId, fileId, 'user1');

      expect(result.url).toBe('http://s3/file');
      expect(result.token).toBe('mock-viewer-token');
    });

    it('should throw NotFound if file not in project', async () => {
      const projectId = 'p1';
      const fileId = 'f1';

      mockFilesService.findOne.mockResolvedValue({ id: fileId, folderId: 'folderX' });
      mockPrismaService.folder.findUnique.mockResolvedValue({ id: 'folderX', projectId: 'other_project' });

      await expect(service.getAccessToken(projectId, fileId, 'user1'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
