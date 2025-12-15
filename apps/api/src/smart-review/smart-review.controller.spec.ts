import { Test, TestingModule } from '@nestjs/testing';
import { SmartReviewController } from './smart-review.controller';
import { SmartReviewService } from './smart-review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockSmartReviewService = {
    createRule: jest.fn(),
    getRules: jest.fn(),
    createReport: jest.fn(),
    getReports: jest.fn(),
};

describe('SmartReviewController', () => {
    let controller: SmartReviewController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SmartReviewController],
            providers: [
                { provide: SmartReviewService, useValue: mockSmartReviewService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<SmartReviewController>(SmartReviewController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a rule', async () => {
        const dto = { name: 'Rule', category: 'Cat', ruleType: 'REGEX' as const, config: {} };
        mockSmartReviewService.createRule.mockResolvedValue({ id: '1', ...dto });
        expect(await controller.createRule(dto)).toEqual({ id: '1', ...dto });
    });

    it('should get rules', async () => {
        mockSmartReviewService.getRules.mockResolvedValue([]);
        expect(await controller.getRules()).toEqual([]);
    });
});
