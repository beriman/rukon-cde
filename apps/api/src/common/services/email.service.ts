import { Injectable } from '@nestjs/common';

// Type definition for Resend (will be resolved after npm install)
interface ResendClient {
    emails: {
        send: (params: { from: string; to: string; subject: string; html: string }) => Promise<any>;
    };
}

@Injectable()
export class EmailService {
    private resend: ResendClient | null = null;
    private fromEmail: string;

    constructor() {
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@rukon-cde.com';

        // Initialize Resend if API key is available
        if (process.env.RESEND_API_KEY) {
            try {
                // Dynamic import to avoid build errors if not installed
                const { Resend } = require('resend');
                this.resend = new Resend(process.env.RESEND_API_KEY);
                console.log('[EMAIL SERVICE] Resend client initialized');
            } catch (error) {
                console.warn('[EMAIL SERVICE] Resend not available, using console fallback');
            }
        }
    }

    async sendPasswordReset(email: string, resetLink: string): Promise<void> {
        const subject = 'Reset Password - Rukon CDE';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1E40AF;">Reset Password</h2>
                <p>Anda menerima email ini karena ada permintaan reset password untuk akun Anda di Rukon CDE.</p>
                <p>Klik tombol di bawah untuk reset password Anda:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Reset Password
                    </a>
                </p>
                <p style="color: #666; font-size: 12px;">Link ini akan kedaluwarsa dalam 1 jam.</p>
                <p style="color: #666; font-size: 12px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
            </div>
        `;

        await this.sendEmail(email, subject, html);
    }

    async sendInvitation(email: string, inviteLink: string, organizationName: string): Promise<void> {
        const subject = `Undangan Bergabung ke ${organizationName} - Rukon CDE`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1E40AF;">Undangan Organisasi</h2>
                <p>Anda telah diundang untuk bergabung dengan organisasi <strong>${organizationName}</strong> di Rukon CDE.</p>
                <p>Klik tombol di bawah untuk menerima undangan:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${inviteLink}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Terima Undangan
                    </a>
                </p>
                <p style="color: #666; font-size: 12px;">Link ini akan kedaluwarsa dalam 7 hari.</p>
            </div>
        `;

        await this.sendEmail(email, subject, html);
    }

    async sendNotification(email: string, title: string, message: string): Promise<void> {
        const subject = `${title} - Rukon CDE`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1E40AF;">${title}</h2>
                <p>${message}</p>
                <hr style="border-color: #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">Email ini dikirim dari Rukon CDE Platform.</p>
            </div>
        `;

        await this.sendEmail(email, subject, html);
    }

    private async sendEmail(to: string, subject: string, html: string): Promise<void> {
        if (this.resend) {
            try {
                const result = await this.resend.emails.send({
                    from: this.fromEmail,
                    to,
                    subject,
                    html,
                });
                console.log(`[EMAIL SERVICE] Email sent to ${to}:`, result);
            } catch (error) {
                console.error(`[EMAIL SERVICE] Failed to send email to ${to}:`, error);
                // Fallback to console log
                this.logEmailToConsole(to, subject, html);
            }
        } else {
            // Fallback: log to console in development
            this.logEmailToConsole(to, subject, html);
        }
    }

    private logEmailToConsole(to: string, subject: string, html: string): void {
        console.log('=============== EMAIL (Development Mode) ===============');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${html.replace(/<[^>]*>/g, ' ').trim()}`);
        console.log('=========================================================');
    }
}

