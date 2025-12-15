import { Test, TestingModule } from '@nestjs/testing';
import { SimulationService } from './simulation.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
    simulationLink: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
    },
};

describe('SimulationService', () => {
    let service: SimulationService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SimulationService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<SimulationService>(SimulationService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createLink', () => {
        it('should create a simulation link', async () => {
            const dto = { taskId: 't1', elementId: 'e1', modelId: 'm1' };
            mockPrismaService.simulationLink.create.mockResolvedValue({ id: '1', projectId: 'p1', ...dto });

            const result = await service.createLink('p1', dto);
            expect(result).toEqual({ id: '1', projectId: 'p1', ...dto });
            expect(prisma.simulationLink.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ projectId: 'p1', taskId: 't1' }),
            });
        });
    });

    describe('getLinks', () => {
        it('should return links', async () => {
            mockPrismaService.simulationLink.findMany.mockResolvedValue([]);
            const result = await service.getLinks('p1');
            expect(result).toEqual([]);
            expect(prisma.simulationLink.findMany).toHaveBeenCalledWith({
                where: { projectId: 'p1' },
                include: { file: { select: { name: true } } }
            });
        });
    });
});
