/**
 * Integration Test: Audit → Actions
 * Verifies that all user actions are properly logged to audit trail
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Integration: Audit → Actions', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('admin');
    });

    test('document view is logged', async ({ page }) => {
        // Step 1: View a document
        await page.locator('[data-testid="nav-documents"]').click();
        await page.locator('[data-testid="doc-item-0"]').click();

        // Step 2: Check audit trail
        await page.locator('[data-testid="nav-audit"]').click();

        // Step 3: Filter by VIEW action
        await page.locator('[data-testid="audit-filter-action"]').selectOption('VIEW');
        await page.locator('[data-testid="audit-apply-filter"]').click();

        // Step 4: Verify view action logged
        await expect(page.locator('[data-testid="audit-entry-0"]')).toContainText('VIEW');
    });

    test('document download is logged', async ({ page }) => {
        await page.locator('[data-testid="nav-documents"]').click();
        await page.locator('[data-testid="doc-item-0"]').click();
        await page.locator('[data-testid="doc-download"]').click();

        await page.locator('[data-testid="nav-audit"]').click();
        await page.locator('[data-testid="audit-filter-action"]').selectOption('DOWNLOAD');
        await page.locator('[data-testid="audit-apply-filter"]').click();

        await expect(page.locator('[data-testid="audit-entry-0"]')).toContainText('DOWNLOAD');
    });

    test('sensitivity classification is logged', async ({ page }) => {
        await page.locator('[data-testid="nav-documents"]').click();
        await page.locator('[data-testid="doc-item-0"]').click();
        await page.locator('[data-testid="doc-classify"]').click();
        await page.locator('[data-testid="sensitivity-level"]').selectOption('CONFIDENTIAL');
        await page.locator('[data-testid="sensitivity-save"]').click();

        await page.locator('[data-testid="nav-audit"]').click();
        await page.locator('[data-testid="audit-filter-action"]').selectOption('CLASSIFY');
        await page.locator('[data-testid="audit-apply-filter"]').click();

        await expect(page.locator('[data-testid="audit-entry-0"]')).toContainText('CLASSIFY');
        await expect(page.locator('[data-testid="audit-entry-0"]')).toContainText('CONFIDENTIAL');
    });

    test('audit trail export works', async ({ page }) => {
        await page.locator('[data-testid="nav-audit"]').click();

        // Export as CSV
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.locator('[data-testid="audit-export-csv"]').click(),
        ]);

        expect(download.suggestedFilename()).toMatch(/audit.*\.csv/);
    });

    test('audit chain integrity verification', async ({ page }) => {
        await page.locator('[data-testid="nav-audit"]').click();
        await page.locator('[data-testid="audit-verify-integrity"]').click();

        // Wait for verification
        await page.waitForSelector('[data-testid="audit-integrity-result"]');
        await expect(page.locator('[data-testid="audit-integrity-result"]')).toContainText('Valid');
    });
});
