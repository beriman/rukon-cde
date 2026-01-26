import { test, expect } from '@playwright/test';

test.describe('File Management Flow', () => {
    test('should login, create folder, upload file, and view it', async ({ page }) => {
        // 1. Mock Login (Setting cookie or bypassing auth if dev mode)
        // For now, let's assume we have a test user or we can use a mock
        // Or we hit the real login page
        await page.goto('/login');
        await page.getByPlaceholder('Email').fill('user@rukon.com');
        await page.getByPlaceholder('Password').fill('password');
        await page.getByRole('button', { name: 'Sign In' }).click();

        // 2. Go to Project
        await page.getByText('Demo Project').first().click();
        await expect(page).toHaveURL(/\/projects\/.*/);

        // 3. Open Upload Wizard
        await page.getByRole('button', { name: 'Upload File' }).click();

        // 4. Fill Wizard Steps
        // Step 1: File Input
        // Note: We need a fixture file
        await page.setInputFiles('input[type="file"]', './e2e/fixtures/test-model.ifc');
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 2: Naming
        await page.getByRole('button', { name: 'Next' }).click(); // Accept defaults for speed

        // Step 3: Confirm
        await page.getByRole('button', { name: 'Confirm Upload' }).click();

        // 5. Verify Toast and Table
        await expect(page.getByText('Successfully uploaded')).toBeVisible();

        // 6. Verify File in List
        await expect(page.getByText('test-model.ifc')).toBeVisible(); // Or the generated ISO name
    });
});
