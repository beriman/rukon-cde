import { Test, TestingModule } from '@nestjs/testing';
import { LoinService, ElementData } from './loin.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
    idsSpecification: {
        findMany: jest.fn(),
    },
};

describe('LoinService', () => {
    let service: LoinService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoinService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<LoinService>(LoinService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe('validateModel', () => {
        it('should pass elements that satisfy the rule', async () => {
            // Mock Rule: IfcWall must have FireRating MATCHES 120
            mockPrismaService.idsSpecification.findMany.mockResolvedValue([
                {
                    id: 'spec-1',
                    rules: [
                        {
                            id: 'rule-1',
                            ifcEntity: 'IfcWall',
                            propertySet: 'Pset_WallCommon',
                            property: 'FireRating',
                            requirement: 'MATCHES',
                            value: '120',
                        },
                    ],
                },
            ]);

            const mockElements: ElementData[] = [
                {
                    guid: 'el-1',
                    type: 'IfcWall',
                    propertySets: [
                        {
                            name: 'Pset_WallCommon',
                            properties: { FireRating: '120' },
                        },
                    ],
                },
            ];

            const report = await service.validateModel('project-1', mockElements);
            expect(report.passed).toBe(1);
            expect(report.failed).toBe(0);
            expect(report.results[0].status).toBe('PASS');
        });

        it('should fail elements that miss the property', async () => {
            mockPrismaService.idsSpecification.findMany.mockResolvedValue([
                {
                    id: 'spec-1',
                    rules: [{
                        ifcEntity: 'IfcWall',
                        propertySet: 'Pset_WallCommon',
                        property: 'FireRating',
                        requirement: 'PRESENT',
                    }],
                },
            ]);

            const mockElements: ElementData[] = [
                {
                    guid: 'el-2',
                    type: 'IfcWall',
                    propertySets: [
                        {
                            name: 'Pset_Other',
                            properties: { Foo: 'Bar' },
                        }
                    ],
                },
            ];

            const report = await service.validateModel('project-1', mockElements);
            expect(report.failed).toBe(1);
            expect(report.results[0].status).toBe('FAIL');
            expect(report.results[0].failedRules[0]).toContain('Missing PropertySet');
        });
    });
});
