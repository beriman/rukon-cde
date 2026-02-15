import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { AuditService } from '../src/common/services/audit.service';
import { JwtService } from '@nestjs/jwt';

// Mock UsersService module to prevent loading FilesService -> ConversionService (which has broken imports)
jest.mock('../src/users/users.service', () => {
    return {
        UsersService: class MockUsersService {}
    };
});

// Import the mocked class
import { UsersService } from '../src/users/users.service';

// Mock PrismaService just in case
jest.mock('../src/prisma/prisma.service', () => {
    return {
        PrismaService: class MockPrismaService {}
    };
});
import { PrismaService } from '../src/prisma/prisma.service';


describe('Google Sync Exploit (e2e)', () => {
  let app: INestApplication;
  const originalFetch = global.fetch;

  const mockUsersServiceInstance = {
    findOneByEmail: jest.fn().mockImplementation((email) => {
      if (email === 'hacker@example.com') {
        return Promise.resolve({
          id: 'user-id',
          email: 'hacker@example.com',
          name: 'Hacker',
          role: 'USER',
          password: 'hashedpassword',
          isActive: true
        });
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((dto) => {
        return Promise.resolve({
            id: 'new-user-id',
            email: dto.email,
            name: dto.name,
            role: 'USER',
            isActive: true
        });
    }),
    findOneById: jest.fn().mockResolvedValue({
        id: 'user-id',
        email: 'hacker@example.com',
        role: 'USER'
    })
  };

  const mockPrismaServiceInstance = {
    refreshToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
        update: jest.fn(),
    },
    user: {
        update: jest.fn(),
    }
  };

  const mockAuditService = {
      log: jest.fn().mockResolvedValue(true)
  };

  const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('fake_jwt_token')
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.AWS_S3_BUCKET = 'test-bucket';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
          AuthService,
          { provide: UsersService, useValue: mockUsersServiceInstance },
          { provide: PrismaService, useValue: mockPrismaServiceInstance },
          { provide: AuditService, useValue: mockAuditService },
          { provide: JwtService, useValue: mockJwtService },
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    global.fetch = originalFetch;
  });

  it('should REJECT login without token', async () => {
    const fakeUser = {
      email: 'hacker@example.com',
      name: 'Hacker'
    };

    await request(app.getHttpServer())
      .post('/auth/google-sync')
      .send(fakeUser)
      .expect(400); // Bad Request (Missing token)
  });

  it('should REJECT login with invalid token', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid token' })
    } as any);

    const fakeUser = {
      email: 'hacker@example.com',
      name: 'Hacker',
      token: 'invalid-token'
    };

    await request(app.getHttpServer())
      .post('/auth/google-sync')
      .send(fakeUser)
      .expect(401); // Unauthorized
  });

  it('should ALLOW login with valid token', async () => {
    // Mock fetch to succeed
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ email: 'hacker@example.com', sub: '123' })
    } as any);

    const validUser = {
      email: 'hacker@example.com',
      name: 'Hacker',
      token: 'valid-token'
    };

    const response = await request(app.getHttpServer())
      .post('/auth/google-sync')
      .send(validUser)
      .expect(200);

    expect(response.body).toHaveProperty('access_token', 'fake_jwt_token');
    expect(response.body.user.email).toBe('hacker@example.com');
  });
});
