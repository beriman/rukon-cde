/**
 * E2E Test: Incident → BCF → Risk Workflow
 * Tests the complete safety incident workflow from report to risk mitigation
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Workflow: Incident → BCF → Risk', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('engineer');
    });

    test('complete safety workflow from incident to risk register', async ({ page }) => {
        // Step 1: Navigate to Incidents
        await page.locator('[data-testid="nav-incidents"]').click();
        await expect(page).toHaveURL(/\/incidents/);

        // Step 2: Report a new incident
        await page.locator('[data-testid="incident-new"]').click();
        await page.locator('[data-testid="incident-type"]').selectOption('NEAR_MISS');
        await page.locator('[data-testid="incident-date"]').fill('2025-01-15');
        await page.locator('[data-testid="incident-location"]').fill('Level 3, Zone B');
        await page.locator('[data-testid="incident-description"]').fill(
            'Unsecured scaffolding near edge - potential fall hazard'
        );
        await page.locator('[data-testid="incident-severity"]').selectOption('HIGH');
        await page.locator('[data-testid="incident-submit"]').click();

        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
        const incidentId = await page.locator('[data-testid="incident-id"]').textContent();

        // Step 3: Create BCF issue from incident
        await page.locator('[data-testid="incident-create-bcf"]').click();
        await expect(page.locator('[data-testid="bcf-modal"]')).toBeVisible();

        // Select viewpoint in 3D viewer
        await page.locator('[data-testid="bcf-select-viewpoint"]').click();
        // Assume viewer is ready
        await page.locator('[data-testid="bcf-capture-viewpoint"]').click();

        await page.locator('[data-testid="bcf-title"]').fill(`Safety Issue: ${incidentId}`);
        await page.locator('[data-testid="bcf-priority"]').selectOption('HIGH');
        await page.locator('[data-testid="bcf-assignee"]').selectOption('safety-manager@test.com');
        await page.locator('[data-testid="bcf-submit"]').click();

        await expect(page.locator('[data-testid="bcf-link-badge"]')).toBeVisible();

        // Step 4: Navigate to BCF module
        await page.locator('[data-testid="nav-bcf"]').click();
        await expect(page).toHaveURL(/\/bcf/);

        // Verify BCF issue exists with incident link
        await page.locator(`text=Safety Issue: ${incidentId}`).click();
        await expect(page.locator('[data-testid="bcf-incident-link"]')).toBeVisible();

        // Step 5: Create Risk from BCF
        await page.locator('[data-testid="bcf-create-risk"]').click();
        await expect(page.locator('[data-testid="risk-modal"]')).toBeVisible();

        await page.locator('[data-testid="risk-category"]').selectOption('SAFETY');
        await page.locator('[data-testid="risk-severity"]').selectOption('4');
        await page.locator('[data-testid="risk-likelihood"]').selectOption('3');
        await page.locator('[data-testid="risk-mitigation"]').fill(
            'Install permanent edge protection. Daily inspection checklist.'
        );
        await page.locator('[data-testid="risk-submit"]').click();

        // Step 6: Navigate to Risk Register
        await page.locator('[data-testid="nav-risks"]').click();
        await expect(page).toHaveURL(/\/risks/);

        // Verify risk appears with correct score (4 × 3 = 12)
        await expect(page.locator('[data-testid="risk-score-12"]')).toBeVisible();

        // Step 7: Verify the complete chain
        await page.locator('[data-testid="risk-item-0"]').click();
        await expect(page.locator('[data-testid="risk-bcf-link"]')).toBeVisible();
        await expect(page.locator('[data-testid="risk-incident-link"]')).toBeVisible();
    });

    test('close BCF issue updates incident status', async ({ page }) => {
        // Create incident with BCF
        await page.locator('[data-testid="nav-incidents"]').click();
        await page.locator('[data-testid="incident-new"]').click();
        await page.locator('[data-testid="incident-type"]').selectOption('NEAR_MISS');
        await page.locator('[data-testid="incident-description"]').fill('Test incident');
        await page.locator('[data-testid="incident-submit"]').click();
        await page.locator('[data-testid="incident-create-bcf"]').click();
        await page.locator('[data-testid="bcf-title"]').fill('Test BCF');
        await page.locator('[data-testid="bcf-submit"]').click();

        // Close BCF issue
        await page.locator('[data-testid="nav-bcf"]').click();
        await page.locator('text=Test BCF').click();
        await page.locator('[data-testid="bcf-close"]').click();
        await page.locator('[data-testid="bcf-close-reason"]').fill('Issue resolved');
        await page.locator('[data-testid="bcf-close-confirm"]').click();

        // Verify incident shows resolved
        await page.locator('[data-testid="nav-incidents"]').click();
        await expect(page.locator('[data-testid="incident-status-resolved"]')).toBeVisible();
    });

    test('high severity incident triggers notification', async ({ page }) => {
        await page.locator('[data-testid="nav-incidents"]').click();
        await page.locator('[data-testid="incident-new"]').click();
        await page.locator('[data-testid="incident-type"]').selectOption('INJURY');
        await page.locator('[data-testid="incident-severity"]').selectOption('CRITICAL');
        await page.locator('[data-testid="incident-description"]').fill('Critical incident');
        await page.locator('[data-testid="incident-submit"]').click();

        // Verify notification sent (check notification indicator)
        await expect(page.locator('[data-testid="notification-sent-badge"]')).toBeVisible();
        await expect(page.locator('[data-testid="notification-count"]')).toContainText('1');
    });
});
