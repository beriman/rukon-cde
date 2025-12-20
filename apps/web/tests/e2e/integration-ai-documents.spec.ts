/**
 * Integration Test: AI → Documents
 * Verifies that AI assistant can search and reference documents
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Integration: AI → Documents', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('engineer');
    });

    test('AI can search indexed documents', async ({ page }) => {
        // Step 1: Upload a document first
        await page.locator('[data-testid="nav-documents"]').click();
        await page.locator('[data-testid="doc-upload"]').click();
        await page.locator('[data-testid="doc-file-input"]').setInputFiles('test-files/spec.pdf');
        await page.locator('[data-testid="doc-title"]').fill('Concrete Specification');
        await page.locator('[data-testid="doc-submit"]').click();
        await page.waitForTimeout(2000); // Wait for indexing

        // Step 2: Open AI Assistant
        await page.locator('[data-testid="nav-ai-assistant"]').click();

        // Step 3: Ask about document content
        await page.locator('[data-testid="ai-input"]').fill('What is the concrete spec?');
        await page.locator('[data-testid="ai-send"]').click();

        // Step 4: Verify AI response includes document reference
        await page.waitForSelector('[data-testid="ai-response"]');
        const response = await page.locator('[data-testid="ai-response"]').textContent();

        expect(response).toBeTruthy();
        await expect(page.locator('[data-testid="ai-source-link"]')).toBeVisible();
    });

    test('AI shows confidence level in responses', async ({ page }) => {
        await page.locator('[data-testid="nav-ai-assistant"]').click();
        await page.locator('[data-testid="ai-input"]').fill('What is in the project documents?');
        await page.locator('[data-testid="ai-send"]').click();

        await page.waitForSelector('[data-testid="ai-response"]');

        // Verify confidence badge exists
        await expect(page.locator('[data-testid="ai-confidence"]')).toBeVisible();
        const confidence = await page.locator('[data-testid="ai-confidence"]').textContent();
        expect(['high', 'medium', 'low']).toContain(confidence?.toLowerCase());
    });

    test('AI conversation maintains context', async ({ page }) => {
        await page.locator('[data-testid="nav-ai-assistant"]').click();

        // First message
        await page.locator('[data-testid="ai-input"]').fill('What is the project about?');
        await page.locator('[data-testid="ai-send"]').click();
        await page.waitForSelector('[data-testid="ai-response"]');

        // Follow-up question
        await page.locator('[data-testid="ai-input"]').fill('Tell me more about that');
        await page.locator('[data-testid="ai-send"]').click();
        await page.waitForSelector('[data-testid="ai-response"]:nth-child(2)');

        // Verify conversation history visible
        const messages = await page.locator('[data-testid^="ai-message"]').count();
        expect(messages).toBeGreaterThanOrEqual(4); // 2 user + 2 AI
    });
});
