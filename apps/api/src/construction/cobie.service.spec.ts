import { Test, TestingModule } from '@nestjs/testing';
import { CobieService } from './cobie.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('CobieService', () => {
    let service: CobieService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        cobieValidation: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CobieService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<CobieService>(CobieService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateFile', () => {
        it('should validate compliant elements correctly', async () => {
            const data = {
                projectId: 'p1',
                fileId: 'f1',
                fileName: 'test.xlsx',
                elements: [
                    {
                        id: 'e1',
                        Name: 'Comp1',
                        TypeName: 'Type1',
                        Space: 'Room1',
                    },
                ],
            };

            mockPrismaService.cobieValidation.create.mockResolvedValue({
                id: 'v1',
                ...data,
                compliantElements: 1,
                complianceScore: 100,
                missingFields: [],
            });

            const result = await service.validateFile(data);

            expect(result.compliantElements).toBe(1);
            expect(result.complianceScore).toBe(100);
            expect(result.missingFields).toEqual([]);
            expect(mockPrismaService.cobieValidation.create).toHaveBeenCalled();
        });

        it('should identify missing fields correctly', async () => {
            const data = {
                projectId: 'p1',
                fileId: 'f1',
                fileName: 'test.xlsx',
                elements: [
                    {
                        id: 'e1',
                        Name: 'Comp1',
                        // TypeName missing
                        Space: 'Room1',
                    },
                ],
            };

            mockPrismaService.cobieValidation.create.mockImplementation((args) => args.data);

            const result = await service.validateFile(data);

            expect(result.compliantElements).toBe(0);
            expect(result.complianceScore).toBe(0);
            expect(result.missingFields).toHaveLength(1);
            expect(result.missingFields[0].missingFields).toContain('TypeName');
        });

        it('should throw BadRequestException if elements are empty', async () => {
            await expect(service.validateFile({
                projectId: 'p1',
                fileId: 'f1',
                fileName: 'test.xlsx',
                elements: [],
            })).rejects.toThrow(BadRequestException);
        });

        it('should handle large number of elements (chunking test)', async () => {
            const elements = Array.from({ length: 6000 }, (_, i) => ({
                id: `e${i}`,
                Name: `Comp${i}`,
                TypeName: `Type${i}`,
                Space: `Room${i}`,
            }));

            const data = {
                projectId: 'p1',
                fileId: 'f1',
                fileName: 'large.xlsx',
                elements,
            };

            mockPrismaService.cobieValidation.create.mockImplementation((args) => args.data);

            const result = await service.validateFile(data);

            expect(result.compliantElements).toBe(6000);
            expect(result.complianceScore).toBe(100);
        });
    });
});
