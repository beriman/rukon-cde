/**
 * E2E Test: BQ → Progress → Payment Workflow
 * Tests the complete billing workflow from quantity survey to payment
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Workflow: BQ → Progress → Payment', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('manager');
    });

    test('complete billing workflow from BQ to payment', async ({ page }) => {
        // Step 1: Navigate to BQ module
        await page.locator('[data-testid="nav-bq"]').click();
        await expect(page).toHaveURL(/\/bq/);

        // Step 2: Create a new BQ item
        await page.locator('[data-testid="bq-add-item"]').click();
        await page.locator('[data-testid="bq-item-code"]').fill('STR-001');
        await page.locator('[data-testid="bq-item-description"]').fill('Structural Concrete');
        await page.locator('[data-testid="bq-item-unit"]').selectOption('m3');
        await page.locator('[data-testid="bq-item-quantity"]').fill('100');
        await page.locator('[data-testid="bq-item-rate"]').fill('500000');
        await page.locator('[data-testid="bq-item-save"]').click();

        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();

        // Step 3: Navigate to Progress module
        await page.locator('[data-testid="nav-progress"]').click();
        await expect(page).toHaveURL(/\/progress/);

        // Step 4: Record progress for the BQ item
        await page.locator('[data-testid="progress-add"]').click();
        await page.locator('[data-testid="progress-bq-item"]').selectOption('STR-001');
        await page.locator('[data-testid="progress-quantity"]').fill('25');
        await page.locator('[data-testid="progress-date"]').fill('2025-01-15');
        await page.locator('[data-testid="progress-save"]').click();

        // Verify progress is 25%
        await expect(page.locator('[data-testid="progress-percentage"]')).toContainText('25%');

        // Step 5: Navigate to Payment module
        await page.locator('[data-testid="nav-payment"]').click();
        await expect(page).toHaveURL(/\/payment/);

        // Step 6: Generate payment certificate
        await page.locator('[data-testid="payment-generate"]').click();
        await page.locator('[data-testid="payment-period"]').selectOption('2025-01');
        await page.locator('[data-testid="payment-submit"]').click();

        // Verify payment amount calculated correctly
        // 25 m3 × 500,000 = 12,500,000
        await expect(page.locator('[data-testid="payment-amount"]')).toContainText('12,500,000');

        // Step 7: Submit for approval
        await page.locator('[data-testid="payment-submit-approval"]').click();
        await expect(page.locator('[data-testid="payment-status"]')).toContainText('Pending Approval');
    });

    test('BQ item with 0 progress shows no payment', async ({ page }) => {
        await page.locator('[data-testid="nav-payment"]').click();

        // Verify items with no progress don't appear in payment
        await expect(page.locator('[data-testid="payment-empty-message"]')).toContainText(
            'No billable items'
        );
    });
});
