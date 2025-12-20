/**
 * Performance Benchmark: File Upload
 * Tests upload speed and concurrent upload handling
 */
import { test, expect } from '@playwright/test';
import { BENCHMARK_TARGETS, evaluateBenchmark, BenchmarkResult } from './benchmark-config';
import * as fs from 'fs';
import * as path from 'path';

const results: BenchmarkResult[] = [];

// Helper to create a test file of specific size
function createTestFile(sizeMB: number): string {
    const filePath = path.join(__dirname, `test-file-${sizeMB}mb.bin`);
    if (!fs.existsSync(filePath)) {
        const buffer = Buffer.alloc(sizeMB * 1024 * 1024, 'x');
        fs.writeFileSync(filePath, buffer);
    }
    return filePath;
}

test.describe('Benchmark: File Upload Performance', () => {
    test.setTimeout(300000); // 5 minutes for large uploads

    test('upload speed >= 5 MB/s for 100MB file', async ({ page }) => {
        const testFile = createTestFile(100);

        await page.goto('/documents');
        await page.locator('[data-testid="doc-upload"]').click();

        const startTime = Date.now();

        // Start upload
        await page.locator('[data-testid="doc-file-input"]').setInputFiles(testFile);
        await page.locator('[data-testid="doc-submit"]').click();

        // Wait for upload complete
        await page.waitForSelector('[data-testid="upload-complete"]', { timeout: 120000 });

        const duration = (Date.now() - startTime) / 1000; // seconds
        const speed = 100 / duration; // MB/s

        const result = evaluateBenchmark('UPLOAD_SPEED', speed);
        results.push(result);

        console.log(`Upload Speed: ${speed.toFixed(2)} MB/s (target: ${BENCHMARK_TARGETS.UPLOAD_SPEED.threshold} MB/s)`);
        expect(result.passed).toBe(true);
    });

    test('handle 100 concurrent uploads', async ({ browser }) => {
        const testFile = createTestFile(1); // 1MB each

        const contexts = await Promise.all(
            Array(100).fill(null).map(() => browser.newContext())
        );

        const pages = await Promise.all(
            contexts.map(ctx => ctx.newPage())
        );

        const successCount = { value: 0 };
        const startTime = Date.now();

        // Start all uploads concurrently
        await Promise.all(
            pages.map(async (page, i) => {
                try {
                    await page.goto('/documents');
                    await page.locator('[data-testid="doc-upload"]').click();
                    await page.locator('[data-testid="doc-file-input"]').setInputFiles(testFile);
                    await page.locator('[data-testid="doc-title"]').fill(`Concurrent Upload ${i}`);
                    await page.locator('[data-testid="doc-submit"]').click();
                    await page.waitForSelector('[data-testid="upload-complete"]', { timeout: 60000 });
                    successCount.value++;
                } catch (e) {
                    console.log(`Upload ${i} failed`);
                }
            })
        );

        const duration = Date.now() - startTime;

        // Cleanup
        await Promise.all(contexts.map(ctx => ctx.close()));

        const result = evaluateBenchmark('UPLOAD_CONCURRENT', successCount.value);
        results.push(result);

        console.log(`Concurrent Uploads: ${successCount.value}/100 success in ${duration}ms`);
        expect(result.passed).toBe(true);
    });

    test('upload with progress feedback', async ({ page }) => {
        const testFile = createTestFile(50);

        await page.goto('/documents');
        await page.locator('[data-testid="doc-upload"]').click();
        await page.locator('[data-testid="doc-file-input"]').setInputFiles(testFile);
        await page.locator('[data-testid="doc-submit"]').click();

        // Verify progress indicator shows
        await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();

        // Wait for progress to update
        await page.waitForFunction(() => {
            const progress = document.querySelector('[data-testid="upload-progress"]');
            return progress && parseInt(progress.textContent || '0') > 0;
        });

        // Verify completion
        await page.waitForSelector('[data-testid="upload-complete"]', { timeout: 120000 });
    });
});
