import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and path
jest.mock('fs');
jest.mock('path');

jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn().mockImplementation(() => ({
        send: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
    CopyObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
}));

describe('FilesService', () => {
    let service: FilesService;

    const mockPrismaService = {};
    const mockNamingService = {};
    const mockAuditService = {};
    const mockConversionService = {};

    beforeEach(async () => {
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

        // Reset env
        delete process.env.AWS_S3_BUCKET;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadSystemFile', () => {
        it('should use basename for system file uploads to prevent path traversal', async () => {
            const orgId = 'org1';
            const file = {
                originalname: 'foo/../../evil.sh',
                buffer: Buffer.from('test content'),
                mimetype: 'text/plain',
            };
            const subfolder = 'signatures';

            // Mock path.join to behave somewhat realistically for the test or just track calls
            // Since we mocked 'path', we need to implement join/basename behavior if we want to assert the result of join
            // Or we can just spy on path.basename if the code calls it.
            // But if the code DOESN'T call path.basename (current state), we want to see what happens.

            // Let's implement a simple mock for path.join and path.basename
            (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
            (path.basename as jest.Mock).mockImplementation((p) => p.split('/').pop());
            (fs.existsSync as jest.Mock).mockReturnValue(true); // Directory exists

            await service.uploadSystemFile(orgId, file, subfolder);

            const expectedPathSuffix = 'evil.sh';
            const writeFileSyncCall = (fs.writeFileSync as jest.Mock).mock.calls[0];
            const filePath = writeFileSyncCall[0];

            // Verify that path.basename was called (This is what we expect AFTER fix)
            // But BEFORE fix, it won't be called.
            // So for "Reproduction", we expect it to FAIL this check or we assert the Bad Behavior.

            // To be safe and follow the "Reproduction Test" plan:
            // I will assert that the path DOES NOT contain 'foo/..' or '..'

            console.log('Write path:', filePath);

            expect(filePath).not.toContain('foo/../../');
            expect(filePath).not.toContain('/../');

            // Also ensure basename was used (implicit in the above if we assume the input had slashes)
            // Or explicitly:
            expect(path.basename).toHaveBeenCalledWith(file.originalname);
        });
    });
});
