import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService - Google Sync Verification', () => {
    let service: AuthService;
    let usersService: Partial<UsersService>;
    let jwtService: Partial<JwtService>;
    let prismaService: Partial<PrismaService>;
    let auditService: Partial<AuditService>;

    const mockFetch = jest.fn();

    // Mock Users
    const mockUser = {
        id: 'user-1',
        email: 'test@gmail.com',
        name: 'Test User',
        role: 'USER',
        password: 'hashed-password',
        isActive: true,
    };

    beforeEach(async () => {
        // Setup mocks
        usersService = {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
        };
        jwtService = {
            signAsync: jest.fn().mockResolvedValue('token'),
        };
        prismaService = {
            refreshToken: {
                create: jest.fn(),
                findUnique: jest.fn(),
                deleteMany: jest.fn(),
            } as any,
            user: {
                update: jest.fn(),
            } as any,
        };
        auditService = {
            log: jest.fn(),
        };

        // Mock global fetch
        global.fetch = mockFetch;

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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw UnauthorizedException if accessToken is missing', async () => {
        await expect(service.googleSync({
            email: 'test@example.com',
            name: 'Test',
            accessToken: '',
        })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if Google token is invalid (API error)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'invalid_token' }),
        });

        await expect(service.googleSync({
            email: 'test@example.com',
            name: 'Test',
            accessToken: 'invalid-token',
        })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                email: 'test@gmail.com',
                email_verified: 'false', // String 'false'
            }),
        });

        await expect(service.googleSync({
            email: 'test@gmail.com',
            name: 'Test',
            accessToken: 'valid-token-unverified',
        })).rejects.toThrow(UnauthorizedException);
    });

    it('should verify token and login existing user', async () => {
        // Mock Google Success
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                email: 'test@gmail.com',
                email_verified: 'true',
            }),
        });

        // Mock User Exists
        (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);

        const result = await service.googleSync({
            email: 'fake@gmail.com', // Client provided different email (should be ignored)
            name: 'Test',
            accessToken: 'valid-token',
        });

        // Verify fetch called with correct URL
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=valid-token')
        );

        // Verify user lookup used GOOGLE email
        expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@gmail.com');

        // Verify login success
        expect(result.user.email).toBe('test@gmail.com');
        expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should verify token and register new user', async () => {
        // Mock Google Success
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                email: 'new@gmail.com',
                email_verified: 'true',
            }),
        });

        // Mock User Not Found
        (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

        // Mock User Creation
        (usersService.create as jest.Mock).mockResolvedValue({
            ...mockUser,
            email: 'new@gmail.com',
            id: 'new-user',
        });

        const result = await service.googleSync({
            email: 'new@gmail.com',
            name: 'New User',
            accessToken: 'valid-token-new',
        });

        expect(usersService.create).toHaveBeenCalledWith({
            email: 'new@gmail.com',
            name: 'New User',
            password: '',
        });

        expect(result.user.id).toBe('new-user');
    });
});
