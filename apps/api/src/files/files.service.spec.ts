import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Mock dependencies
jest.mock('../prisma/prisma.service');
jest.mock('../common/services/naming-convention.service');
jest.mock('../common/services/audit.service');
jest.mock('../common/services/conversion.service');
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
  CopyObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('FilesService Security Check', () => {
  let service: FilesService;

  beforeEach(async () => {
    // Ensure AWS_S3_BUCKET is undefined for local fallback
    delete process.env.AWS_S3_BUCKET;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        PrismaService,
        NamingConventionService,
        AuditService,
        ConversionService,
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should prevent path traversal in uploadSystemFile via filename', async () => {
    const maliciousFilename = '../../etc/passwd';
    const subfolder = 'assets';
    const file = {
      originalname: maliciousFilename,
      buffer: Buffer.from('test'),
      mimetype: 'text/plain',
    };

    // Spy on fs.writeFileSync
    // Since we mocked fs, we can just use the mock
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    await service.uploadSystemFile('org-123', file, subfolder);

    // Get the path argument
    const writeFileSyncMock = fs.writeFileSync as jest.Mock;
    expect(writeFileSyncMock).toHaveBeenCalled();
    const filePath = writeFileSyncMock.mock.calls[0][0] as string;

    // If vulnerable, filePath will contain '..', so this expectation will FAIL
    expect(filePath).not.toContain('..');
  });

  it('should prevent path traversal in uploadSystemFile via subfolder', async () => {
     const maliciousSubfolder = '../../pwned';
     const file = {
       originalname: 'safe.txt',
       buffer: Buffer.from('test'),
       mimetype: 'text/plain',
     };

     (fs.existsSync as jest.Mock).mockReturnValue(true);

     // Expect it to throw BadRequestException or sanitize
     // Since current implementation does NOT validate subfolder, this will FAIL (it will not throw)
     await expect(service.uploadSystemFile('org-123', file, maliciousSubfolder))
       .rejects
       .toThrow(BadRequestException);
  });
});
