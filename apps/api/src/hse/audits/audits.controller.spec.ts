import { Test, TestingModule } from '@nestjs/testing';
import { AuditsController } from './audits.controller';
import { AuditsService } from './audits.service';

describe('AuditsController', () => {
  let controller: AuditsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditsController],
      providers: [
        {
          provide: AuditsService,
          useValue: {
            createAudit: jest.fn(),
            getAudits: jest.fn(),
            getAudit: jest.fn(),
            updateFinding: jest.fn(),
            createContact: jest.fn(),
            findAllContacts: jest.fn(),
            deleteContact: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuditsController>(AuditsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
