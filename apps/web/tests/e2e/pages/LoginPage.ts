/**
 * Page Object: Login Page
 */
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async login(email: string, password: string) {
        await this.goto('/login');
        await this.fillInput('email-input', email);
        await this.fillInput('password-input', password);
        await this.clickButton('login-submit');
        await this.waitForLoader();
    }

    async loginAsRole(role: 'admin' | 'manager' | 'engineer' | 'viewer') {
        const credentials: Record<string, { email: string; password: string }> = {
            admin: { email: 'admin@test.com', password: 'testpass123' },
            manager: { email: 'manager@test.com', password: 'testpass123' },
            engineer: { email: 'engineer@test.com', password: 'testpass123' },
            viewer: { email: 'viewer@test.com', password: 'testpass123' },
        };
        const { email, password } = credentials[role];
        await this.login(email, password);
    }
}
