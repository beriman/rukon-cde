import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let prismaService: Partial<PrismaService>;
  let auditService: Partial<AuditService>;

  beforeEach(async () => {
    // Mock UsersService
    usersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
    };

    // Mock JwtService
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
    };

    // Mock PrismaService
    prismaService = {
      refreshToken: {
        create: jest.fn(),
      } as any,
      user: {
        update: jest.fn(),
      } as any,
    };

    // Mock AuditService
    auditService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prismaService },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Mock global fetch
    global.fetch = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleSync', () => {
    it('should throw UnauthorizedException if token is missing', async () => {
      await expect(service.googleSync({ email: 'test@example.com', name: 'Test' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({ error_description: 'Invalid token' }),
      });

      await expect(service.googleSync({ email: 'test@example.com', name: 'Test', token: 'bad-token' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email not verified', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({ email: 'test@example.com', email_verified: 'false' }),
      });

      await expect(service.googleSync({ email: 'test@example.com', name: 'Test', token: 'unverified-token' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should succeed with valid token and return tokens', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({ email: 'verified@example.com', email_verified: 'true' }),
      });

      const mockUser = { id: 'user-id', email: 'verified@example.com', name: 'Test User', role: 'USER' };
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.googleSync({ email: 'ignored@example.com', name: 'Test', token: 'valid-token' });

      expect(usersService.findOneByEmail).toHaveBeenCalledWith('verified@example.com'); // Must use token email
      expect(result).toHaveProperty('access_token', 'mock-token');
      expect(result).toHaveProperty('refresh_token', 'mock-token');
    });
  });
});
