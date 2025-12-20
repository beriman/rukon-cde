/**
 * Page Object: Base Page
 * Common methods for all page objects
 */
import { Page, expect } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async goto(path: string) {
        await this.page.goto(path);
    }

    async waitForLoader() {
        const loader = this.page.locator('[data-testid="loading"]');
        if (await loader.isVisible()) {
            await loader.waitFor({ state: 'hidden', timeout: 30000 });
        }
    }

    async clickButton(testId: string) {
        await this.page.locator(`[data-testid="${testId}"]`).click();
    }

    async fillInput(testId: string, value: string) {
        await this.page.locator(`[data-testid="${testId}"]`).fill(value);
    }

    async selectOption(testId: string, value: string) {
        await this.page.locator(`[data-testid="${testId}"]`).selectOption(value);
    }

    async expectText(testId: string, text: string) {
        await expect(this.page.locator(`[data-testid="${testId}"]`)).toContainText(text);
    }

    async expectVisible(testId: string) {
        await expect(this.page.locator(`[data-testid="${testId}"]`)).toBeVisible();
    }

    async expectToast(message: string) {
        await expect(this.page.locator('.toast, [role="alert"]')).toContainText(message);
    }
}
