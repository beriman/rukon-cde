import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService Security', () => {
    let service: EmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService],
        }).compile();

        service = module.get<EmailService>(EmailService);
    });

    it('should escape HTML in organization name to prevent injection', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const maliciousName = '<script>alert(1)</script>';
        const email = 'test@example.com';
        const link = 'http://example.com';

        await service.sendInvitation(email, link, maliciousName);

        // We capture calls to console.log
        // The service logs: "Content: ..." where tags are stripped using regex /<[^>]*>/g
        // If vulnerable: html contains <script>... -> stripped -> logs "alert(1)"
        // If fixed: html contains &lt;script&gt;... -> NOT stripped -> logs "&lt;script&gt;alert(1)&lt;/script&gt;"

        const calls = logSpy.mock.calls.map(args => args[0]).join('\n');

        // Check if the escaped version is present
        expect(calls).toContain('&lt;script&gt;');
        expect(calls).toContain('&lt;/script&gt;');

        logSpy.mockRestore();
    });

    it('should escape HTML in notification title and message', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const maliciousTitle = '<b>Bold Title</b>';
        const maliciousMessage = '<img src=x onerror=alert(1)>';
        const email = 'test@example.com';

        await service.sendNotification(email, maliciousTitle, maliciousMessage);

        const calls = logSpy.mock.calls.map(args => args[0]).join('\n');

        expect(calls).toContain('&lt;b&gt;Bold Title&lt;/b&gt;');
        expect(calls).toContain('&lt;img src=x onerror=alert(1)&gt;');

        logSpy.mockRestore();
    });
});
