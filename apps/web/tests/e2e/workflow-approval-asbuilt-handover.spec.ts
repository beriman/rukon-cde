/**
 * E2E Test: Approval → As-Built → Handover Workflow
 * Tests the complete document lifecycle from approval to handover
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Workflow: Approval → As-Built → Handover', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('manager');
    });

    test('complete document lifecycle from approval to handover', async ({ page }) => {
        // Step 1: Navigate to Documents
        await page.locator('[data-testid="nav-documents"]').click();
        await expect(page).toHaveURL(/\/documents/);

        // Step 2: Upload a document
        await page.locator('[data-testid="doc-upload"]').click();
        await page.locator('[data-testid="doc-file-input"]').setInputFiles('test-files/drawing.pdf');
        await page.locator('[data-testid="doc-title"]').fill('Foundation Drawing Rev 1');
        await page.locator('[data-testid="doc-category"]').selectOption('STRUCTURAL');
        await page.locator('[data-testid="doc-submit"]').click();

        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();

        // Step 3: Submit for approval
        await page.locator('[data-testid="doc-item-0"]').click();
        await page.locator('[data-testid="doc-submit-approval"]').click();
        await expect(page.locator('[data-testid="doc-status"]')).toContainText('Pending');

        // Step 4: Login as approver and approve
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('admin');

        await page.locator('[data-testid="nav-approvals"]').click();
        await page.locator('[data-testid="approval-item-0"]').click();
        await page.locator('[data-testid="approval-approve"]').click();
        await page.locator('[data-testid="approval-comment"]').fill('Approved for construction');
        await page.locator('[data-testid="approval-confirm"]').click();

        // Step 5: Verify document is approved
        await expect(page.locator('[data-testid="doc-status"]')).toContainText('Approved');

        // Step 6: Mark as As-Built
        await page.locator('[data-testid="nav-documents"]').click();
        await page.locator('[data-testid="doc-item-0"]').click();
        await page.locator('[data-testid="doc-mark-asbuilt"]').click();
        await page.locator('[data-testid="asbuilt-confirm"]').click();

        await expect(page.locator('[data-testid="doc-asbuilt-badge"]')).toBeVisible();

        // Step 7: Navigate to Handover
        await page.locator('[data-testid="nav-handover"]').click();
        await expect(page).toHaveURL(/\/handover/);

        // Step 8: Verify document appears in handover checklist
        await expect(page.locator('[data-testid="handover-asbuilt-count"]')).not.toContainText('0');

        // Step 9: Complete handover checklist item
        await page.locator('[data-testid="handover-asbuilt-check"]').click();
        await expect(page.locator('[data-testid="handover-progress"]')).toContainText('1');
    });

    test('rejected document does not appear in as-built list', async ({ page }) => {
        // Upload and reject flow
        await page.locator('[data-testid="nav-documents"]').click();
        await page.locator('[data-testid="doc-upload"]').click();
        await page.locator('[data-testid="doc-file-input"]').setInputFiles('test-files/drawing.pdf');
        await page.locator('[data-testid="doc-title"]').fill('Rejected Drawing');
        await page.locator('[data-testid="doc-submit"]').click();
        await page.locator('[data-testid="doc-submit-approval"]').click();

        // Login as admin and reject
        const loginPage = new LoginPage(page);
        await loginPage.loginAsRole('admin');

        await page.locator('[data-testid="nav-approvals"]').click();
        await page.locator('[data-testid="approval-item-0"]').click();
        await page.locator('[data-testid="approval-reject"]').click();
        await page.locator('[data-testid="approval-comment"]').fill('Does not meet standards');
        await page.locator('[data-testid="approval-confirm"]').click();

        // Verify as-built marking is disabled
        await page.locator('[data-testid="nav-documents"]').click();
        await page.locator('text=Rejected Drawing').click();
        await expect(page.locator('[data-testid="doc-mark-asbuilt"]')).toBeDisabled();
    });
});
