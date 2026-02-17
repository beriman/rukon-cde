import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuditService } from '../common/services/audit.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    async register(dto: RegisterDto) {
        try {
            const { email, password, confirmPassword, name } = dto;

            if (password !== confirmPassword) {
                throw new BadRequestException('Passwords do not match');
            }

            // Check if user exists
            const existingUser = await this.usersService.findOneByEmail(email);

            if (existingUser) {
                throw new ConflictException('Email already in use');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await this.usersService.create({
                email,
                password: hashedPassword,
                name,
            });

            // Audit Log
            // Note: We might not log register if user not fully active, but good for security.
            // However, userId is available now.
            // For now, let's keep it simple.

            return {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
        } catch (error) {
            // Re-throw HTTP exceptions
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            // Handle Prisma errors
            if (error.code === 'P2002') {
                throw new ConflictException('Email already in use');
            }

            // Unexpected errors
            throw new InternalServerErrorException('Registration failed');
        }
    }

    async login(dto: LoginDto) {
        try {
            const { email, password } = dto;

            // Find user
            const user = await this.usersService.findOneByEmail(email);

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Check if user is active
            if (user.isActive === false) {
                throw new UnauthorizedException('Account has been deactivated');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Update last login timestamp
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });

            // Generate tokens
            const tokens = await this.generateTokens(user.id, user.email, user.role);
            await this.updateRefreshToken(user.id, tokens.refresh_token);

            // Audit Log
            await this.auditService.log(
                user.id,
                AuditAction.LOGIN,
                undefined,
                undefined,
                { ip: 'captured-in-controller-ideally' }
            );

            return {
                ...tokens,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
        } catch (error) {
            // Re-throw HTTP exceptions
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            // Handle Prisma errors
            if (error.code === 'P2025') {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Unexpected errors
            throw new InternalServerErrorException('Login failed');
        }
    }

    async refresh(userId: string, refreshToken: string) {
        const user = await this.usersService.findOneById(userId);
        if (!user) throw new UnauthorizedException('Access Denied');

        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new UnauthorizedException('Access Denied');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: string) {
        // Delete refresh tokens
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId,
            },
        });

        // Audit Log
        await this.auditService.log(userId, AuditAction.LOGOUT);

        return true;
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });
    }

    async generateTokens(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async verifyGoogleToken(token: string) {
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Google Token Verification Failed:', error);
            return null;
        }
    }

    async googleSync(dto: { email: string; name: string; token?: string }) {
        // Security Fix: Verify Google Token
        if (!dto.token) {
            throw new UnauthorizedException('Google Access Token is required');
        }

        const tokenInfo = await this.verifyGoogleToken(dto.token);

        if (!tokenInfo || tokenInfo.email !== dto.email) {
            throw new UnauthorizedException('Invalid Google Access Token');
        }

        let user = await this.usersService.findOneByEmail(dto.email);

        if (!user) {
            // Auto-register user from Google
            user = await this.usersService.create({
                email: dto.email,
                name: dto.name,
                password: '', // OAuth users don't have local passwords
            });
            
            await this.auditService.log(user.id, AuditAction.LOGIN, undefined, undefined, { method: 'GOOGLE_OAUTH_NEW' });
        } else {
            await this.auditService.log(user.id, AuditAction.LOGIN, undefined, undefined, { method: 'GOOGLE_OAUTH_EXISTING' });
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
}
