import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockUsersService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const mockPrismaService = {
      user: { update: jest.fn() },
      refreshToken: { findUnique: jest.fn(), create: jest.fn(), deleteMany: jest.fn() },
    };

    const mockAuditService = {
      log: jest.fn(),
    };

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
