import { Test, TestingModule } from '@nestjs/testing';
import { HseController } from './hse.controller';

describe('HseController', () => {
  let controller: HseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HseController],
    }).compile();

    controller = module.get<HseController>(HseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
