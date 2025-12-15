import { Test, TestingModule } from '@nestjs/testing';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockSimulationService = {
    createLink: jest.fn(),
    getLinks: jest.fn(),
    deleteLink: jest.fn(),
};

describe('SimulationController', () => {
    let controller: SimulationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SimulationController],
            providers: [
                { provide: SimulationService, useValue: mockSimulationService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<SimulationController>(SimulationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a link', async () => {
        const dto = { taskId: 't1', elementId: 'e1', modelId: 'm1' };
        mockSimulationService.createLink.mockResolvedValue({ id: '1', ...dto });
        expect(await controller.create('p1', dto)).toEqual({ id: '1', ...dto });
    });

    it('should get links', async () => {
        mockSimulationService.getLinks.mockResolvedValue([]);
        expect(await controller.findAll('p1')).toEqual([]);
    });
});
