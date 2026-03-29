import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import * as fs from 'fs';
import * as path from 'path';

describe('FilesService Security', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: NamingConventionService,
          useValue: {},
        },
        {
          provide: AuditService,
          useValue: {},
        },
        {
          provide: ConversionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);

    // Mock environment to ensure local fallback is used
    process.env.AWS_S3_BUCKET = '';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should sanitize filename to prevent path traversal', async () => {
    const maliciousFilename = 'foo/../../../../tmp/pwned.txt';
    const organizationId = 'test-org';
    const file = {
      originalname: maliciousFilename,
      buffer: Buffer.from('test content'),
      mimetype: 'text/plain',
    };

    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined as any);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    await service.uploadSystemFile(organizationId, file);

    const writtenPath = writeFileSyncSpy.mock.calls[0][0] as string;
    console.log('Sanitized Path:', writtenPath);

    // Expected: uploads/org-test-org/system/assets/timestamp-pwned.txt
    // The timestamp is dynamic, so we check using path.basename or regex

    const expectedDir = path.join(process.cwd(), 'uploads', `org-${organizationId}`, 'system', 'assets');
    const actualDir = path.dirname(writtenPath);

    expect(actualDir).toBe(expectedDir);
    expect(path.basename(writtenPath)).toMatch(/^\d+-pwned\.txt$/);
  });

  it('should sanitize subfolder to prevent path traversal', async () => {
    const filename = 'test.txt';
    const maliciousSubfolder = '../../../../tmp';
    const organizationId = 'test-org';
    const file = {
      originalname: filename,
      buffer: Buffer.from('test content'),
      mimetype: 'text/plain',
    };

    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined as any);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    await service.uploadSystemFile(organizationId, file, maliciousSubfolder);

    const writtenPath = writeFileSyncSpy.mock.calls[0][0] as string;
    console.log('Sanitized Subfolder Path:', writtenPath);

    // Expected: uploads/org-test-org/system/tmp/timestamp-test.txt
    // Since path.basename('.../tmp') -> 'tmp'

    const expectedDir = path.join(process.cwd(), 'uploads', `org-${organizationId}`, 'system', 'tmp');
    const actualDir = path.dirname(writtenPath);

    expect(actualDir).toBe(expectedDir);
    expect(path.basename(writtenPath)).toMatch(/^\d+-test\.txt$/);
  });
});
