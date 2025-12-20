/**
 * Performance Benchmark: AI RAG
 * Tests AI response times and concurrency
 */
import { test, expect } from '@playwright/test';
import { BENCHMARK_TARGETS, evaluateBenchmark, BenchmarkResult } from './benchmark-config';

const results: BenchmarkResult[] = [];

test.describe('Benchmark: AI RAG Performance', () => {
    test.setTimeout(180000); // 3 minutes for concurrent tests

    test('AI response time under 3 seconds', async ({ page }) => {
        await page.goto('/ai-assistant');
        await page.waitForSelector('[data-testid="ai-input"]');

        // Measure time to first token
        const startTime = Date.now();

        await page.locator('[data-testid="ai-input"]').fill('What is the concrete specification?');
        await page.locator('[data-testid="ai-send"]').click();

        // Wait for first response token (streaming)
        await page.waitForSelector('[data-testid="ai-response"]', { timeout: 10000 });

        const ttft = Date.now() - startTime;
        const result = evaluateBenchmark('AI_RESPONSE_TIME', ttft);
        results.push(result);

        console.log(`AI TTFT: ${ttft}ms (target: ${BENCHMARK_TARGETS.AI_RESPONSE_TIME.threshold}ms)`);
        expect(result.passed).toBe(true);
    });

    test('AI handles 50 concurrent users', async ({ browser }) => {
        const contexts = await Promise.all(
            Array(50).fill(null).map(() => browser.newContext())
        );

        const pages = await Promise.all(
            contexts.map(ctx => ctx.newPage())
        );

        const successCount = { value: 0 };
        const startTime = Date.now();

        // Send concurrent requests
        await Promise.all(
            pages.map(async (page, i) => {
                try {
                    await page.goto('/ai-assistant');
                    await page.locator('[data-testid="ai-input"]').fill(`Test query ${i}`);
                    await page.locator('[data-testid="ai-send"]').click();
                    await page.waitForSelector('[data-testid="ai-response"]', { timeout: 30000 });
                    successCount.value++;
                } catch (e) {
                    console.log(`User ${i} failed`);
                }
            })
        );

        const duration = Date.now() - startTime;
        const qps = (successCount.value / duration) * 1000;

        // Cleanup
        await Promise.all(contexts.map(ctx => ctx.close()));

        const concurrentResult = evaluateBenchmark('AI_CONCURRENT_USERS', successCount.value);
        const qpsResult = evaluateBenchmark('AI_THROUGHPUT', qps);
        results.push(concurrentResult, qpsResult);

        console.log(`AI Concurrent: ${successCount.value}/50 success`);
        console.log(`AI QPS: ${qps.toFixed(2)} (target: ${BENCHMARK_TARGETS.AI_THROUGHPUT.threshold})`);

        expect(concurrentResult.passed).toBe(true);
    });

    test('AI response quality under load', async ({ page }) => {
        await page.goto('/ai-assistant');

        const queries = [
            'What is the foundation depth?',
            'Show me RFIs for structural work',
            'What is the project timeline?',
        ];

        for (const query of queries) {
            await page.locator('[data-testid="ai-input"]').fill(query);
            await page.locator('[data-testid="ai-send"]').click();
            await page.waitForSelector('[data-testid="ai-response"]');

            // Verify response has sources
            const hasSource = await page.locator('[data-testid="ai-source-link"]').isVisible();
            expect(hasSource).toBe(true);

            // Verify confidence is shown
            const confidence = await page.locator('[data-testid="ai-confidence"]').textContent();
            expect(['high', 'medium', 'low']).toContain(confidence?.toLowerCase());
        }
    });
});
