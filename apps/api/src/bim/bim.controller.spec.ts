import { Test, TestingModule } from '@nestjs/testing';
import { BimController } from './bim.controller';
import { BimService } from './bim.service';

describe('BimController', () => {
  let controller: BimController;

  const mockBimService = {
    getAccessToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BimController],
      providers: [
        { provide: BimService, useValue: mockBimService },
      ],
    }).compile();

    controller = module.get<BimController>(BimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service to get access token', async () => {
    mockBimService.getAccessToken.mockResolvedValue({ token: 't', url: 'u', expires: 100 });

    const result = await controller.getModelToken('p1', 'f1', { user: { id: 'u1' } });

    expect(result).toEqual({ token: 't', url: 'u', expires: 100 });
    expect(mockBimService.getAccessToken).toHaveBeenCalledWith('p1', 'f1', 'u1');
  });
});
