/**
 * Performance Benchmark: 3D Viewer
 * Tests IFC model loading and rendering performance
 */
import { test, expect } from '@playwright/test';
import { BENCHMARK_TARGETS, evaluateBenchmark, BenchmarkResult } from './benchmark-config';

const results: BenchmarkResult[] = [];

test.describe('Benchmark: 3D Viewer Performance', () => {
    test.setTimeout(120000); // 2 minutes for large model tests

    test('3D viewer load time for 500MB model', async ({ page }) => {
        // Navigate to viewer with large model
        const startTime = Date.now();

        await page.goto('/viewer?model=large-test-model.ifc');

        // Wait for model to fully load
        await page.waitForSelector('[data-testid="viewer-loaded"]', { timeout: 60000 });

        const loadTime = Date.now() - startTime;
        const result = evaluateBenchmark('VIEWER_LOAD_TIME', loadTime);
        results.push(result);

        console.log(`3D Viewer Load Time: ${loadTime}ms (target: ${BENCHMARK_TARGETS.VIEWER_LOAD_TIME.threshold}ms)`);
        expect(result.passed).toBe(true);
    });

    test('3D viewer maintains 30+ FPS during navigation', async ({ page }) => {
        await page.goto('/viewer?model=test-model.ifc');
        await page.waitForSelector('[data-testid="viewer-loaded"]');

        // Start FPS monitoring
        const fpsValues: number[] = [];

        await page.evaluate(() => {
            (window as any).__fpsValues = [];
            let lastTime = performance.now();
            let frameCount = 0;

            const measureFPS = () => {
                frameCount++;
                const now = performance.now();
                if (now - lastTime >= 1000) {
                    (window as any).__fpsValues.push(frameCount);
                    frameCount = 0;
                    lastTime = now;
                }
                requestAnimationFrame(measureFPS);
            };
            requestAnimationFrame(measureFPS);
        });

        // Perform navigation actions
        for (let i = 0; i < 5; i++) {
            await page.mouse.move(400, 300);
            await page.mouse.down();
            await page.mouse.move(600, 400, { steps: 20 });
            await page.mouse.up();
            await page.waitForTimeout(1000);
        }

        // Get FPS values
        const measuredFPS = await page.evaluate(() => (window as any).__fpsValues);
        const avgFPS = measuredFPS.reduce((a: number, b: number) => a + b, 0) / measuredFPS.length;

        const result = evaluateBenchmark('VIEWER_FPS', avgFPS);
        results.push(result);

        console.log(`3D Viewer FPS: ${avgFPS.toFixed(1)} (target: ${BENCHMARK_TARGETS.VIEWER_FPS.threshold})`);
        expect(result.passed).toBe(true);
    });

    test('3D viewer memory usage under 2GB', async ({ page }) => {
        await page.goto('/viewer?model=large-test-model.ifc');
        await page.waitForSelector('[data-testid="viewer-loaded"]');

        // Get memory usage
        const metrics = await page.evaluate(() => {
            if ((performance as any).memory) {
                return {
                    usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                    totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                };
            }
            return null;
        });

        if (metrics) {
            const memoryMB = metrics.usedJSHeapSize / (1024 * 1024);
            const result = evaluateBenchmark('VIEWER_MEMORY', memoryMB);
            results.push(result);

            console.log(`3D Viewer Memory: ${memoryMB.toFixed(0)}MB (target: ${BENCHMARK_TARGETS.VIEWER_MEMORY.threshold}MB)`);
            expect(result.passed).toBe(true);
        }
    });
});
