import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    async sendPasswordReset(email: string, resetLink: string): Promise<void> {
        // TODO: Implement with NodeMailer or SendGrid
        // For now, log to console for development
        console.log(`[EMAIL SERVICE] Password reset link for ${email}: ${resetLink}`);
        console.log('TODO: Configure SMTP credentials in .env');

        // Future implementation:
        // await this.mailerService.sendMail({
        //   to: email,
        //   subject: 'Password Reset Request',
        //   template: 'password-reset',
        //   context: { resetLink },
        // });
    }

    async sendInvitation(email: string, inviteLink: string, organizationName: string): Promise<void> {
        console.log(`[EMAIL SERVICE] Invitation for ${email} to ${organizationName}: ${inviteLink}`);
        console.log('TODO: Configure SMTP credentials in .env');
    }
}
