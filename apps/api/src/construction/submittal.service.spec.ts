import { Test, TestingModule } from '@nestjs/testing';
import { SubmittalService } from './submittal.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmittalType } from '@prisma/client';

describe('SubmittalService', () => {
    let service: SubmittalService;
    let prisma: PrismaService;

    const mockPrismaService = {
        submittal: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubmittalService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<SubmittalService>(SubmittalService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createSubmittal', () => {
        it('should generate correct reference number for shop drawing', async () => {
            mockPrismaService.submittal.count.mockResolvedValue(5);
            mockPrismaService.submittal.create.mockResolvedValue({
                id: 'sub-1',
                referenceNumber: 'SD-006',
                type: 'SHOP_DRAWING',
            });

            await service.createSubmittal({
                projectId: 'proj-1',
                type: SubmittalType.SHOP_DRAWING,
                title: 'Test Drawing',
                fileId: 'file-1',
                submittedBy: 'user-1',
            });

            expect(prisma.submittal.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        referenceNumber: 'SD-006',
                    }),
                })
            );
        });
    });

    describe('submitForApproval', () => {
        it('should update status to SUBMITTED', async () => {
            mockPrismaService.submittal.findUnique.mockResolvedValue({ id: 'sub-1' });
            mockPrismaService.submittal.update.mockResolvedValue({
                id: 'sub-1',
                status: 'SUBMITTED',
            });

            const result = await service.submitForApproval('sub-1');
            expect(result.status).toBe('SUBMITTED');
        });
    });
});
