import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { NamingConventionService } from '../common/services/naming-convention.service';
import { AuditService } from '../common/services/audit.service';
import { ConversionService } from '../common/services/conversion.service';
import { BadRequestException } from '@nestjs/common';

describe('FilesService', () => {
    let service: FilesService;

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
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('uploadSystemFile', () => {
        it('should throw error if subfolder contains traversal characters', async () => {
             const file = { originalname: 'test.png', buffer: Buffer.from('test'), mimetype: 'image/png' };
             await expect(service.uploadSystemFile('org1', file, '../../evil')).rejects.toThrow(BadRequestException);
        });

        it('should sanitize filename to prevent path traversal', async () => {
             const file = { originalname: '../../test.png', buffer: Buffer.from('test'), mimetype: 'image/png' };
             const result = await service.uploadSystemFile('org1', file, 'assets');

             expect(result.s3Key).not.toContain('../');
             expect(result.s3Key).toContain('test.png');
        });
    });
});
