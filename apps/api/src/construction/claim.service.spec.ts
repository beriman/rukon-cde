import { Test, TestingModule } from '@nestjs/testing';
import { ClaimService } from './claim.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClaimService', () => {
    let service: ClaimService;
    let prisma: PrismaService;

    const mockPrismaService = {
        progressClaim: {
            create: jest.fn(),
            update: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
        },
        variationOrder: {
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClaimService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ClaimService>(ClaimService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createClaim', () => {
        it('should calculate total amount correctly', async () => {
            mockPrismaService.progressClaim.findFirst.mockResolvedValue({ claimNumber: 2 });
            mockPrismaService.progressClaim.create.mockResolvedValue({
                id: 'claim-1',
                claimNumber: 3,
                totalAmount: 150000,
            });

            await service.createClaim({
                projectId: 'proj-1',
                period: 'Month 3',
                baseAmount: 100000,
                voAmount: 50000,
                submittedBy: 'user-1',
            });

            expect(prisma.progressClaim.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        totalAmount: 150000,
                        claimNumber: 3,
                    }),
                })
            );
        });
    });

    describe('getClaimSummary', () => {
        it('should calculate summary correctly', async () => {
            mockPrismaService.progressClaim.findMany.mockResolvedValue([
                { totalAmount: 100000, certifiedAmount: 95000, status: 'PAID' },
                { totalAmount: 150000, certifiedAmount: 140000, status: 'CERTIFIED' },
            ]);

            const result = await service.getClaimSummary('proj-1');

            expect(result.totalClaimed).toBe(250000);
            expect(result.totalCertified).toBe(235000);
            expect(result.totalPaid).toBe(100000);
            expect(result.outstandingPayment).toBe(135000);
        });
    });
});
