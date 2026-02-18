import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuditAction } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;
  let prismaService: any;
  let auditService: any;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    findOneById: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockToken'),
  };

  const mockPrismaService = {
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
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

    // Reset mocks
    jest.clearAllMocks();

    // Mock global fetch
    global.fetch = jest.fn() as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleSync', () => {
    it('should throw UnauthorizedException if Google token is invalid', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(service.googleSync({ accessToken: 'invalid_token' })).rejects.toThrow(UnauthorizedException);
    });

    it('should verify token and return tokens for existing user', async () => {
      const mockPayload = { email: 'test@example.com', name: 'Test User' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPayload),
      });

      const mockUser = { id: 'userId', email: 'test@example.com', name: 'Test User', role: 'USER', isActive: true, password: 'hash' };
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);

      const result = await service.googleSync({ accessToken: 'valid_token' });

      expect(global.fetch).toHaveBeenCalledWith('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: 'Bearer valid_token' },
      });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockAuditService.log).toHaveBeenCalledWith('userId', AuditAction.LOGIN, undefined, undefined, { method: 'GOOGLE_OAUTH_EXISTING' });
      expect(result).toHaveProperty('access_token');
    });

    it('should verify token and create new user if not exists', async () => {
      const mockPayload = { email: 'new@example.com', name: 'New User' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockPayload),
      });

      mockUsersService.findOneByEmail.mockResolvedValue(null);
      const newUser = { id: 'newId', email: 'new@example.com', name: 'New User', role: 'USER' };
      mockUsersService.create.mockResolvedValue(newUser);

      const result = await service.googleSync({ accessToken: 'valid_token' });

      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        name: 'New User',
        password: '',
      });
      expect(mockAuditService.log).toHaveBeenCalledWith('newId', AuditAction.LOGIN, undefined, undefined, { method: 'GOOGLE_OAUTH_NEW' });
      expect(result).toHaveProperty('access_token');
    });
  });
});
