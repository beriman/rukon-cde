import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/services/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitationsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    async create(organizationId: string, email: string, role: string = 'MEMBER', invitedBy?: string) {
        // Check if user already exists in organization
        const existingMember = await this.prisma.organizationUser.findFirst({
            where: {
                organizationId,
                user: { email },
            },
        });

        if (existingMember) {
            throw new BadRequestException('User is already a member of this organization');
        }

        // Invalidate previous invitations for same email
        await this.prisma.invitation.updateMany({
            where: {
                organizationId,
                email,
                used: false,
                expiresAt: { gt: new Date() },
            },
            data: { used: true },
        });

        // Generate secure token
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        const invitation = await this.prisma.invitation.create({
            data: {
                email,
                organizationId,
                token,
                role: role as any,
                expiresAt,
                invitedBy,
            },
            include: {
                organization: true,
            },
        });

        // Send invitation email
        const inviteLink = `${process.env.FRONTEND_URL}/accept-invitation/${token}`;
        await this.emailService.sendInvitation(email, inviteLink, invitation.organization.name);

        return {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            expiresAt: invitation.expiresAt,
        };
    }

    async verifyToken(token: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
            include: { organization: true },
        });

        if (!invitation || invitation.used) {
            throw new NotFoundException('Invalid or expired invitation');
        }

        if (new Date() > invitation.expiresAt) {
            throw new BadRequestException('Invitation has expired');
        }

        return {
            email: invitation.email,
            organizationId: invitation.organizationId,
            organizationName: invitation.organization.name,
            role: invitation.role,
        };
    }

    async acceptInvitation(token: string, userId: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
        });

        if (!invitation || invitation.used) {
            throw new NotFoundException('Invalid or expired invitation');
        }

        if (new Date() > invitation.expiresAt) {
            throw new BadRequestException('Invitation has expired');
        }

        // Add user to organization
        await this.prisma.organizationUser.create({
            data: {
                userId,
                organizationId: invitation.organizationId,
                role: invitation.role,
            },
        });

        // Mark invitation as used
        await this.prisma.invitation.update({
            where: { id: invitation.id },
            data: { used: true },
        });

        return { message: 'Successfully joined organization' };
    }
}
