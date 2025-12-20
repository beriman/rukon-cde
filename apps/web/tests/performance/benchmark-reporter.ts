/**
 * Benchmark Report Generator
 * Generates markdown report from benchmark results
 */
import * as fs from 'fs';
import * as path from 'path';
import { BENCHMARK_TARGETS, BenchmarkResult } from './benchmark-config';

interface BenchmarkSummary {
    timestamp: Date;
    environment: string;
    passed: number;
    failed: number;
    results: BenchmarkResult[];
}

export function generateBenchmarkReport(results: BenchmarkResult[]): string {
    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;

    let report = `# Performance Benchmark Report

**Date**: ${new Date().toISOString()}
**Environment**: ${process.env.NODE_ENV || 'development'}

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${results.length} |
| Passed | ${passed} ✅ |
| Failed | ${failed} ❌ |
| Pass Rate | ${((passed / results.length) * 100).toFixed(1)}% |

---

## Results by Category

### 3D Viewer Performance

| Benchmark | Target | Result | Status |
|-----------|--------|--------|--------|
`;

    // Add viewer results
    const viewerResults = results.filter(r => r.target.startsWith('VIEWER'));
    for (const r of viewerResults) {
        const target = BENCHMARK_TARGETS[r.target];
        report += `| ${target.name} | ${target.threshold} ${target.unit} | ${r.value.toFixed(2)} ${target.unit} | ${r.passed ? '✅' : '❌'} |\n`;
    }

    report += `
### AI RAG Performance

| Benchmark | Target | Result | Status |
|-----------|--------|--------|--------|
`;

    // Add AI results
    const aiResults = results.filter(r => r.target.startsWith('AI'));
    for (const r of aiResults) {
        const target = BENCHMARK_TARGETS[r.target];
        report += `| ${target.name} | ${target.threshold} ${target.unit} | ${r.value.toFixed(2)} ${target.unit} | ${r.passed ? '✅' : '❌'} |\n`;
    }

    report += `
### File Upload Performance

| Benchmark | Target | Result | Status |
|-----------|--------|--------|--------|
`;

    // Add upload results
    const uploadResults = results.filter(r => r.target.startsWith('UPLOAD'));
    for (const r of uploadResults) {
        const target = BENCHMARK_TARGETS[r.target];
        report += `| ${target.name} | ${target.threshold} ${target.unit} | ${r.value.toFixed(2)} ${target.unit} | ${r.passed ? '✅' : '❌'} |\n`;
    }

    report += `
### Report Generation Performance

| Benchmark | Target | Result | Status |
|-----------|--------|--------|--------|
`;

    // Add report results
    const reportResults = results.filter(r => r.target.startsWith('REPORT'));
    for (const r of reportResults) {
        const target = BENCHMARK_TARGETS[r.target];
        report += `| ${target.name} | ${target.threshold} ${target.unit} | ${r.value.toFixed(2)} ${target.unit} | ${r.passed ? '✅' : '❌'} |\n`;
    }

    report += `
---

## Recommendations

${failed > 0 ? `
> [!WARNING]
> ${failed} benchmark(s) failed to meet targets. Review the following:

${results.filter(r => !r.passed).map(r => {
        const target = BENCHMARK_TARGETS[r.target];
        return `- **${target.name}**: ${r.value.toFixed(2)} ${target.unit} (target: ${target.threshold} ${target.unit})`;
    }).join('\n')}
` : `
> [!NOTE]
> All benchmarks passed! System is performing within acceptable limits.
`}

## Test Environment

- Node.js: ${process.version}
- Platform: ${process.platform}
- Architecture: ${process.arch}

---

*Report generated automatically by Performance Benchmark Suite*
`;

    return report;
}

export function saveBenchmarkReport(results: BenchmarkResult[], outputDir: string = 'benchmark-reports'): void {
    const report = generateBenchmarkReport(results);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `benchmark-report-${timestamp}.md`;

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outputDir, filename), report);
    console.log(`Benchmark report saved: ${filename}`);
}
