import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    googleSync: jest.fn().mockResolvedValue({ user: { email: 'test@example.com' }, access_token: 'test' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleSync', () => {
    it('should call authService.googleSync with dto including providerToken', async () => {
      const dto = { email: 'test@example.com', name: 'Test', providerToken: 'token' };
      const result = await controller.googleSync(dto);

      expect(mockAuthService.googleSync).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('user');
    });
  });
});
