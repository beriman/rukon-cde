import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { GoogleSyncDto } from './dto/auth.dto';

describe('AuthService - Google Sync', () => {
    let service: AuthService;
    let usersService: Partial<UsersService>;
    let jwtService: Partial<JwtService>;
    let prismaService: Partial<PrismaService>;
    let auditService: Partial<AuditService>;

    beforeEach(async () => {
        // Mock dependencies
        usersService = {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
        };
        jwtService = {
            signAsync: jest.fn().mockResolvedValue('mock_token'),
        };
        prismaService = {
            refreshToken: {
                create: jest.fn(),
                deleteMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
            } as any,
            user: {
                update: jest.fn(),
            } as any,
        };
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

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw BadRequestException if accessToken is missing', async () => {
        const dto: GoogleSyncDto = { email: 'test@example.com' };
        await expect(service.googleSync(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if Google token is invalid', async () => {
        const dto: GoogleSyncDto = { accessToken: 'invalid_token' };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'invalid_token' }),
        });

        await expect(service.googleSync(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
        const dto: GoogleSyncDto = { accessToken: 'valid_token' };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ email: 'test@example.com', email_verified: 'false' }),
        });

        await expect(service.googleSync(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should login successfully with valid verified token (string "true")', async () => {
        const dto: GoogleSyncDto = { accessToken: 'valid_token' };
        const email = 'verified@example.com';

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ email, email_verified: 'true' }),
        });

        const mockUser = { id: 'user1', email, role: 'USER', isActive: true, password: 'hash' };
        (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);

        const result = await service.googleSync(dto);

        expect(result).toBeDefined();
        expect(result.access_token).toBe('mock_token');
        expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
        expect(auditService.log).toHaveBeenCalled();
    });

    it('should login successfully with valid verified token (boolean true)', async () => {
        const dto: GoogleSyncDto = { accessToken: 'valid_token_bool' };
        const email = 'verified_bool@example.com';

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ email, email_verified: true }),
        });

        const mockUser = { id: 'user2', email, role: 'USER', isActive: true, password: 'hash' };
        (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);

        const result = await service.googleSync(dto);

        expect(result).toBeDefined();
        expect(result.access_token).toBe('mock_token');
        expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    });
});
