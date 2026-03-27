import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

// Mock dependencies
const mockPrismaService = {
  $transaction: jest.fn(),
  folder: { findUnique: jest.fn() },
  file: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn() },
  invitation: { findFirst: jest.fn() },
  user: { findUnique: jest.fn() },
};

const mockNamingService = {
  validate: jest.fn(),
};

const mockAuditService = {
  log: jest.fn(),
};

const mockConversionService = {
  processFile: jest.fn(),
};

describe('FilesService Security', () => {
  let service: FilesService;

  beforeEach(async () => {
    // Clear mocks
    jest.clearAllMocks();

    // Ensure AWS_S3_BUCKET is undefined to force local fallback
    delete process.env.AWS_S3_BUCKET;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NamingConventionService, useValue: mockNamingService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: ConversionService, useValue: mockConversionService },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should prevent path traversal in uploadSystemFile via filename', async () => {
    const orgId = 'org123';
    const subfolder = 'headers';
    const maliciousFile = {
      originalname: '../../../../etc/passwd',
      buffer: Buffer.from('malicious content'),
      mimetype: 'text/plain',
    };

    // Spy on fs.writeFileSync to check where it tries to write
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined as any);

    await service.uploadSystemFile(orgId, maliciousFile, subfolder);

    // Get the path argument passed to writeFileSync
    const calledPath = writeSpy.mock.calls[0][0] as string;

    console.log('Writing to:', calledPath);

    const cwd = process.cwd();
    const expectedRoot = path.join(cwd, 'uploads', `org-${orgId}`, 'system', subfolder);

    expect(calledPath.startsWith(expectedRoot)).toBe(true);
    expect(calledPath.includes('passwd')).toBe(true);
    // Should contain sanitized name
  });

  it('should prevent path traversal via subfolder', async () => {
    const orgId = 'org123';
    const subfolder = '../evil';
    const file = {
      originalname: 'test.txt',
      buffer: Buffer.from('content'),
      mimetype: 'text/plain',
    };

    await expect(service.uploadSystemFile(orgId, file, subfolder))
      .rejects
      .toThrow(BadRequestException);
  });
});
