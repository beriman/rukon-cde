import { Test, TestingModule } from '@nestjs/testing';
import { SubmittalService } from './submittal.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SubmittalService', () => {
    let service: SubmittalService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubmittalService,
                {
                    provide: PrismaService,
                    useValue: {
                        submittal: {
                            count: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<SubmittalService>(SubmittalService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createSubmittal', () => {
        it('should create a submittal with generated reference number', async () => {
            jest.spyOn(prisma.submittal, 'count').mockResolvedValue(2);
            jest.spyOn(prisma.submittal, 'create').mockResolvedValue({
                id: 'sub-1',
                referenceNumber: 'SD-003',
                type: 'SHOP_DRAWING',
            } as any);

            const result = await service.createSubmittal({
                projectId: 'proj-1',
                type: 'SHOP_DRAWING' as any,
                title: 'Test Drawing',
                submittedBy: 'user-1',
            });

            expect(result.referenceNumber).toBe('SD-003');
        });
    });

    describe('submitForApproval', () => {
        it('should update submittal status to SUBMITTED', async () => {
            jest.spyOn(prisma.submittal, 'findUnique').mockResolvedValue({ id: 'sub-1' } as any);
            jest.spyOn(prisma.submittal, 'update').mockResolvedValue({
                id: 'sub-1',
                status: 'SUBMITTED',
            } as any);

            const result = await service.submitForApproval('sub-1');

            expect(result.status).toBe('SUBMITTED');
            expect(prisma.submittal.update).toHaveBeenCalledWith({
                where: { id: 'sub-1' },
                data: { status: 'SUBMITTED' },
            });
        });
    });
});
