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

    async googleSync(dto: { email: string; name: string; providerToken: string; provider?: string }) {
        if (!dto.providerToken) {
            throw new UnauthorizedException('Provider token is required');
        }

        try {
            // Check if it's a Supabase JWT or a Google Token
            // A simple heuristic: if it has 3 parts separated by dots, it's likely a JWT (or Google ID Token)
            // But we should try decoding it as Supabase token first
            let isVerified = false;

            try {
                // Try verifying as Supabase JWT
                const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
                const payload = await this.jwtService.verifyAsync(dto.providerToken, {
                    secret: jwtSecret
                });

                // If we get here, it's a valid Supabase token
                // Check if the email matches
                if (payload.email !== dto.email) {
                    throw new UnauthorizedException('Email mismatch in token');
                }
                isVerified = true;
            } catch (jwtError) {
                // Not a valid Supabase JWT, fallback to Google tokeninfo
            }

            if (!isVerified) {
                // Unconditionally verify Google tokens using tokeninfo
                let response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${dto.providerToken}`);

                if (!response.ok) {
                    // Try as ID token if access token fails
                    response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${dto.providerToken}`);
                }

                if (!response.ok) {
                    throw new UnauthorizedException('Invalid provider token');
                }

                const tokenInfo = await response.json();

                // Prevent Confused Deputy attacks by verifying audience
                if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID) {
                    throw new UnauthorizedException('Invalid token audience');
                }

                // Verify email matches
                if (tokenInfo.email !== dto.email) {
                    throw new UnauthorizedException('Email mismatch');
                }
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Failed to verify token');
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
