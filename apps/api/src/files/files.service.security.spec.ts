import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('FilesService Security', () => {
  let service: FilesService;
  let originalS3BucketEnv: string | undefined;

  beforeAll(() => {
    originalS3BucketEnv = process.env.AWS_S3_BUCKET;
    delete process.env.AWS_S3_BUCKET; // Force local mode
  });

  afterAll(() => {
    process.env.AWS_S3_BUCKET = originalS3BucketEnv;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: PrismaService, useValue: {} },
        { provide: NamingConventionService, useValue: {} },
        { provide: AuditService, useValue: {} },
        { provide: ConversionService, useValue: {} },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    jest.clearAllMocks();
  });

  it('should prevent path traversal in subfolder', async () => {
    const file = {
      buffer: Buffer.from('test'),
      originalname: 'test.txt',
      mimetype: 'text/plain',
    };

    // Attempt path traversal
    const badSubfolder = '../../etc';

    // Expect it to throw BadRequestException
    await expect(service.uploadSystemFile('org1', file, badSubfolder))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should sanitize filename to prevent traversal', async () => {
    const file = {
      buffer: Buffer.from('test'),
      // Use a path that breaks out of the prefix 'timestamp-'
      originalname: 'folder/../../../../evil.sh',
      mimetype: 'text/plain',
    };

    const subfolder = 'safe';

    await service.uploadSystemFile('org1', file, subfolder);

    const writeFileSync = fs.writeFileSync as jest.Mock;
    expect(writeFileSync).toHaveBeenCalled();
    const filePath = writeFileSync.mock.calls[0][0];

    // Check if the file path is contained within the expected directory
    const expectedDir = path.join(process.cwd(), 'uploads', 'org-org1', 'system', subfolder);

    // With vulnerability, this might be false (it would be /evil.sh or similar)
    // With fix, it must be true
    expect(filePath.startsWith(expectedDir)).toBe(true);

    // Also check that the filename part doesn't have slashes (it should be flattened)
    const basename = path.basename(filePath);
    // The basename should roughly match timestamp-evil.sh (sanitized)
    // It should NOT match timestamp-folder/../../../../evil.sh
    expect(basename).toMatch(/^\d+-evil\.sh$/);
  });
});
