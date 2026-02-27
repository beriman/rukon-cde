import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

// Mock dependencies
const mockPrismaService = {};
const mockNamingConventionService = {};
const mockAuditService = {};
const mockConversionService = {};

// Mock S3 Client
jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockResolvedValue({}),
    })),
    PutObjectCommand: jest.fn(),
}));

describe('FilesService - Path Traversal Security', () => {
    let service: FilesService;

    beforeEach(async () => {
        // Clear environment variables to force local fallback
        delete process.env.AWS_S3_BUCKET;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilesService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: NamingConventionService, useValue: mockNamingConventionService },
                { provide: AuditService, useValue: mockAuditService },
                { provide: ConversionService, useValue: mockConversionService },
            ],
        }).compile();

        service = module.get<FilesService>(FilesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw BadRequestException if subfolder contains traversal characters', async () => {
        const organizationId = 'org-123';
        const file = { originalname: 'test.pdf', buffer: Buffer.from('test'), mimetype: 'application/pdf' };
        const maliciousSubfolder = '../../etc';

        // This should fail currently
        await expect(service.uploadSystemFile(organizationId, file, maliciousSubfolder))
            .rejects
            .toThrow(BadRequestException);
    });

    it('should sanitize filename to prevent path traversal', async () => {
        const organizationId = 'org-123';
        const file = { originalname: '../../../malicious.exe', buffer: Buffer.from('test'), mimetype: 'application/pdf' };
        const subfolder = 'assets';

        // Spy on fs.writeFileSync to capture the path
        const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { });
        jest.spyOn(fs, 'existsSync').mockReturnValue(true); // Pretend dir exists
        jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined); // Mock mkdir

        await service.uploadSystemFile(organizationId, file, subfolder);

        expect(writeSpy).toHaveBeenCalled();
        const callArgs = writeSpy.mock.calls[0];
        const writtenPath = callArgs[0] as string;

        console.log('Written Path:', writtenPath);

        // We expect it NOT to have traversal chars if fixed
        // The filename includes a timestamp prefix, so we check if it ENDS with the sanitized name
        expect(path.basename(writtenPath)).toMatch(/-malicious.exe$/);
        expect(writtenPath).not.toContain('..');
    });
});
