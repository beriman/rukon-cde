import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { UnauthorizedException } from '@nestjs/common';

const mockUsersService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock_token'),
};

const mockPrismaService = {
  refreshToken: {
    create: jest.fn(),
  },
};

const mockAuditService = {
  log: jest.fn(),
};

describe('AuthService - Google Auth Vulnerability', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Mock global fetch
    global.fetch = jest.fn() as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should validate Google token and return user tokens', async () => {
    // Mock successful Google token validation
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ email: 'test@example.com', email_verified: 'true', name: 'Test User' }),
    });

    mockUsersService.findOneByEmail.mockResolvedValue({
      id: 'user_1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
    });

    // Currently fails type check because googleSync expects { email, name }
    // We cast to any to simulate the new payload
    const result = await service.googleSync({ token: 'valid_google_token' } as any);

    // This expectation will fail until we update the service
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=valid_google_token')
    );
    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    // Mock failed Google token validation
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(service.googleSync({ token: 'invalid_token' } as any))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if email is not verified', async () => {
     (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ email: 'test@example.com', email_verified: 'false' }),
    });

    await expect(service.googleSync({ token: 'valid_token_unverified_email' } as any))
      .rejects.toThrow(UnauthorizedException);
  });
});
