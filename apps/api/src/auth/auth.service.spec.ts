import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('test-token'),
  };

  const mockPrismaService = {
    refreshToken: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  };

  const mockAuditService = {
    log: jest.fn(),
  };

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
    usersService = module.get<UsersService>(UsersService);

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleSync', () => {
    it('should throw if providerToken is missing', async () => {
      await expect(service.googleSync({ email: 'test@example.com', name: 'Test' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if Google tokeninfo API returns an error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(service.googleSync({ email: 'test@example.com', name: 'Test', providerToken: 'invalid' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if email_verified is false', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ email_verified: 'false', email: 'test@example.com' }),
      });

      await expect(service.googleSync({ email: 'test@example.com', name: 'Test', providerToken: 'valid' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if email does not match', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ email_verified: 'true', email: 'other@example.com' }),
      });

      await expect(service.googleSync({ email: 'test@example.com', name: 'Test', providerToken: 'valid' })).rejects.toThrow(UnauthorizedException);
    });

    it('should sync successfully with valid token', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ email_verified: 'true', email: 'test@example.com' }),
      });

      mockUsersService.findOneByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test',
        role: 'USER',
      });

      const result = await service.googleSync({ email: 'test@example.com', name: 'Test', providerToken: 'valid' });
      expect(result).toHaveProperty('access_token', 'test-token');
      expect(result.user).toHaveProperty('email', 'test@example.com');
    });
  });
});
