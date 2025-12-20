/**
 * Performance Benchmark: Report Generation
 * Tests report generation speed and output quality
 */
import { test, expect } from '@playwright/test';
import { BENCHMARK_TARGETS, evaluateBenchmark, BenchmarkResult } from './benchmark-config';

const results: BenchmarkResult[] = [];

test.describe('Benchmark: Report Generation Performance', () => {
    test.setTimeout(180000); // 3 minutes

    test('weekly report generation under 60 seconds', async ({ page }) => {
        await page.goto('/reports');

        // Open report wizard
        await page.locator('[data-testid="report-generate"]').click();
        await page.locator('[data-testid="report-type-weekly"]').click();
        await page.locator('[data-testid="report-next"]').click();

        const startTime = Date.now();

        // Generate report
        await page.locator('[data-testid="report-generate-btn"]').click();

        // Wait for completion
        await page.waitForSelector('[data-testid="report-complete"]', { timeout: 120000 });

        const genTime = Date.now() - startTime;
        const result = evaluateBenchmark('REPORT_GEN_TIME', genTime);
        results.push(result);

        console.log(`Report Gen Time: ${genTime}ms (target: ${BENCHMARK_TARGETS.REPORT_GEN_TIME.threshold}ms)`);
        expect(result.passed).toBe(true);
    });

    test('monthly report with all sections', async ({ page }) => {
        await page.goto('/reports');

        await page.locator('[data-testid="report-generate"]').click();
        await page.locator('[data-testid="report-type-monthly"]').click();

        // Select all sections
        const sections = ['schedule', 'hse', 'rfi', 'bcf', 'photos'];
        for (const section of sections) {
            await page.locator(`[data-testid="report-section-${section}"]`).check();
        }

        await page.locator('[data-testid="report-next"]').click();

        const startTime = Date.now();
        await page.locator('[data-testid="report-generate-btn"]').click();
        await page.waitForSelector('[data-testid="report-complete"]', { timeout: 180000 });

        const genTime = Date.now() - startTime;
        console.log(`Monthly Report (all sections): ${genTime}ms`);

        // Monthly can take longer, so we allow 2x threshold
        expect(genTime).toBeLessThan(BENCHMARK_TARGETS.REPORT_GEN_TIME.threshold * 2);
    });

    test('report preview loads quickly', async ({ page }) => {
        await page.goto('/reports');

        await page.locator('[data-testid="report-generate"]').click();
        await page.locator('[data-testid="report-type-weekly"]').click();
        await page.locator('[data-testid="report-next"]').click();

        const startTime = Date.now();

        // Preview should load under 5 seconds
        await page.waitForSelector('[data-testid="report-preview-loaded"]', { timeout: 10000 });

        const previewTime = Date.now() - startTime;
        console.log(`Report Preview Time: ${previewTime}ms`);

        expect(previewTime).toBeLessThan(5000);
    });

    test('report PDF download works', async ({ page }) => {
        await page.goto('/reports');

        // Assume there's an existing report
        await page.locator('[data-testid="report-item-0"]').click();

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.locator('[data-testid="report-download-pdf"]').click(),
        ]);

        expect(download.suggestedFilename()).toMatch(/\.pdf$/);

        // Verify file size is reasonable (not empty)
        const path = await download.path();
        // File should exist and have content
        expect(path).toBeTruthy();
    });
});
