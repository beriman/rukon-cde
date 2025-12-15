import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TemplatesService', () => {
    let service: TemplatesService;

    const mockPrismaService = {
        inspectionTemplate: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
        emergencyDrill: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TemplatesService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<TemplatesService>(TemplatesService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createTemplate', () => {
        it('should create a template', async () => {
            const dto = {
                name: 'Risk Assessment Template',
                url: 'https://example.com/template.pdf',
                category: 'FORM',
                description: 'Standard risk assessment form',
            } as any;

            const mockTemplate = { id: '1', ...dto };
            mockPrismaService.inspectionTemplate.create.mockResolvedValue(mockTemplate);

            const result = await service.createTemplate(dto);

            expect(result).toEqual(mockTemplate);
        });
    });

    describe('getTemplates', () => {
        it('should return templates', async () => {
            const mockTemplates = [{ id: '1', name: 'T1' }];
            mockPrismaService.inspectionTemplate.findMany.mockResolvedValue(mockTemplates);

            const result = await service.getTemplates();

            expect(result).toEqual(mockTemplates);
        });
    });
});
