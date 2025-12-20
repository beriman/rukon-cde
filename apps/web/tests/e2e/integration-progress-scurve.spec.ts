/**
 * Integration Test: Progress → S-Curve
 * Verifies that progress updates correctly flow to S-Curve calculations
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Integration: Progress → S-Curve', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('manager');
    });

    test('progress updates reflect in S-Curve chart', async ({ page }) => {
        // Step 1: Navigate to S-Curve
        await page.locator('[data-testid="nav-scurve"]').click();
        const initialActual = await page.locator('[data-testid="scurve-actual-value"]').textContent();
        const initialValue = parseFloat(initialActual?.replace('%', '') || '0');

        // Step 2: Navigate to Progress and add entry
        await page.locator('[data-testid="nav-progress"]').click();
        await page.locator('[data-testid="progress-add"]').click();
        await page.locator('[data-testid="progress-bq-item"]').selectOption({ index: 0 });
        await page.locator('[data-testid="progress-quantity"]').fill('10');
        await page.locator('[data-testid="progress-save"]').click();

        // Step 3: Return to S-Curve
        await page.locator('[data-testid="nav-scurve"]').click();
        await page.waitForTimeout(1000); // Allow chart to update

        // Step 4: Verify actual line has increased
        const newActual = await page.locator('[data-testid="scurve-actual-value"]').textContent();
        const newValue = parseFloat(newActual?.replace('%', '') || '0');

        expect(newValue).toBeGreaterThan(initialValue);
    });

    test('S-Curve planned vs actual variance displays correctly', async ({ page }) => {
        await page.locator('[data-testid="nav-scurve"]').click();

        // Verify both lines exist
        await expect(page.locator('[data-testid="scurve-planned-line"]')).toBeVisible();
        await expect(page.locator('[data-testid="scurve-actual-line"]')).toBeVisible();

        // Verify variance calculation
        const variance = await page.locator('[data-testid="scurve-variance"]').textContent();
        expect(variance).toMatch(/[+-]?\d+\.?\d*%/);
    });
});
