/**
 * Integration Test: Manhours → Attendance
 * Verifies that manhour entries sync with attendance tracking
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Integration: Manhours → Attendance', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('manager');
    });

    test('attendance records appear in manhour totals', async ({ page }) => {
        // Step 1: Navigate to Attendance
        await page.locator('[data-testid="nav-attendance"]').click();

        // Step 2: Record attendance for workers
        await page.locator('[data-testid="attendance-add"]').click();
        await page.locator('[data-testid="attendance-date"]').fill('2025-01-15');
        await page.locator('[data-testid="attendance-worker"]').selectOption({ index: 0 });
        await page.locator('[data-testid="attendance-hours"]').fill('8');
        await page.locator('[data-testid="attendance-save"]').click();

        // Step 3: Navigate to Manhours dashboard
        await page.locator('[data-testid="nav-manhours"]').click();

        // Step 4: Verify manhours include attendance
        await page.locator('[data-testid="manhours-date-filter"]').fill('2025-01-15');
        await page.locator('[data-testid="manhours-apply-filter"]').click();

        const totalHours = await page.locator('[data-testid="manhours-total"]').textContent();
        expect(parseInt(totalHours || '0')).toBeGreaterThanOrEqual(8);
    });

    test('manhours breakdown shows worker categories', async ({ page }) => {
        await page.locator('[data-testid="nav-manhours"]').click();

        // Verify category breakdown exists
        await expect(page.locator('[data-testid="manhours-by-category"]')).toBeVisible();

        // Common worker categories
        const categories = ['Skilled', 'Unskilled', 'Supervision'];
        for (const cat of categories) {
            await expect(page.locator(`[data-testid="manhours-cat-${cat.toLowerCase()}"]`)).toBeVisible();
        }
    });

    test('manhours overtime calculation', async ({ page }) => {
        // Record overtime attendance
        await page.locator('[data-testid="nav-attendance"]').click();
        await page.locator('[data-testid="attendance-add"]').click();
        await page.locator('[data-testid="attendance-hours"]').fill('10'); // 2 hours OT
        await page.locator('[data-testid="attendance-save"]').click();

        // Check manhours shows OT
        await page.locator('[data-testid="nav-manhours"]').click();
        await expect(page.locator('[data-testid="manhours-overtime"]')).toContainText('2');
    });
});
