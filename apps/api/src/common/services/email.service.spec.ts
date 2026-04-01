import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
    let service: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService],
        }).compile();

        service = module.get<EmailService>(EmailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendInvitation', () => {
        it('should escape HTML in organization name', async () => {
            const sendEmailSpy = jest.spyOn(service as any, 'sendEmail').mockImplementation(() => Promise.resolve());

            const maliciousOrgName = '<script>alert("XSS")</script>';
            await service.sendInvitation('test@example.com', 'http://example.com', maliciousOrgName);

            expect(sendEmailSpy).toHaveBeenCalled();
            const [email, subject, html] = sendEmailSpy.mock.calls[0];

            expect(html).not.toContain('<script>');
            expect(html).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        });
    });

    describe('sendNotification', () => {
        it('should escape HTML in title and message', async () => {
            const sendEmailSpy = jest.spyOn(service as any, 'sendEmail').mockImplementation(() => Promise.resolve());

            const maliciousTitle = '<h1>Title</h1>';
            const maliciousMessage = '<img src=x onerror=alert(1)>';

            await service.sendNotification('test@example.com', maliciousTitle, maliciousMessage);

            const [email, subject, html] = sendEmailSpy.mock.calls[0];

            expect(html).not.toContain('<h1>');
            expect(html).toContain('&lt;h1&gt;Title&lt;/h1&gt;');
            expect(html).not.toContain('<img');
            expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
        });
    });
});
