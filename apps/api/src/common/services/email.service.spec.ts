import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
    let service: EmailService;
    let consoleSpy: jest.SpyInstance;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService],
        }).compile();

        service = module.get<EmailService>(EmailService);
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendInvitation', () => {
        it('should escape HTML in organization name', async () => {
            const email = 'test@example.com';
            const inviteLink = 'http://example.com/invite';
            const maliciousOrgName = '<script>alert("xss")</script>My Org';

            await service.sendInvitation(email, inviteLink, maliciousOrgName);

            // Check the console output (fallback mode)
            const logCall = consoleSpy.mock.calls.find(call => call[0] && call[0].includes('Content:'));
            expect(logCall).toBeDefined();
            const content = logCall[0];

            // Expect the script tags to be escaped
            expect(content).not.toContain('<script>');
            expect(content).toContain('&lt;script&gt;');
            expect(content).toContain('&lt;/script&gt;');
        });
    });

    describe('sendNotification', () => {
        it('should escape HTML in title and message', async () => {
            const email = 'test@example.com';
            const maliciousTitle = '<b>Bold Title</b>';
            const maliciousMessage = '<img src=x onerror=alert(1)>';

            await service.sendNotification(email, maliciousTitle, maliciousMessage);

            const logCall = consoleSpy.mock.calls.find(call => call[0] && call[0].includes('Content:'));
            expect(logCall).toBeDefined();
            const content = logCall[0];

            expect(content).not.toContain('<b>');
            expect(content).toContain('&lt;b&gt;');
            expect(content).not.toContain('<img');
            expect(content).toContain('&lt;img');
        });
    });
});
