/**
 * Performance Benchmark Configuration
 * Defines targets and thresholds for all benchmarks
 */

export interface BenchmarkTarget {
    name: string;
    description: string;
    metric: string;
    threshold: number;
    unit: string;
    critical: boolean;
}

export const BENCHMARK_TARGETS: Record<string, BenchmarkTarget> = {
    // 3D Viewer
    VIEWER_LOAD_TIME: {
        name: '3D Viewer Load Time',
        description: 'Time to fully load a 500MB IFC model',
        metric: 'loadTime',
        threshold: 30000, // 30 seconds
        unit: 'ms',
        critical: true,
    },
    VIEWER_FPS: {
        name: '3D Viewer FPS',
        description: 'Average frames per second during navigation',
        metric: 'fps',
        threshold: 30, // 30 FPS minimum
        unit: 'fps',
        critical: true,
    },
    VIEWER_MEMORY: {
        name: '3D Viewer Memory',
        description: 'Peak memory usage',
        metric: 'memory',
        threshold: 2048, // 2GB max
        unit: 'MB',
        critical: false,
    },

    // AI RAG
    AI_RESPONSE_TIME: {
        name: 'AI Response Time',
        description: 'Time to first token in AI response',
        metric: 'ttft',
        threshold: 3000, // 3 seconds
        unit: 'ms',
        critical: true,
    },
    AI_CONCURRENT_USERS: {
        name: 'AI Concurrent Users',
        description: 'Supported concurrent AI queries',
        metric: 'concurrent',
        threshold: 50,
        unit: 'users',
        critical: true,
    },
    AI_THROUGHPUT: {
        name: 'AI Query Throughput',
        description: 'Queries per second under load',
        metric: 'qps',
        threshold: 10,
        unit: 'qps',
        critical: false,
    },

    // File Upload
    UPLOAD_SPEED: {
        name: 'Upload Speed',
        description: 'Upload speed for large files',
        metric: 'speed',
        threshold: 5, // 5 MB/s minimum
        unit: 'MB/s',
        critical: true,
    },
    UPLOAD_CONCURRENT: {
        name: 'Concurrent Uploads',
        description: 'Supported concurrent file uploads',
        metric: 'concurrent',
        threshold: 100,
        unit: 'uploads',
        critical: true,
    },

    // Report Generation
    REPORT_GEN_TIME: {
        name: 'Report Generation Time',
        description: 'Time to generate weekly report',
        metric: 'genTime',
        threshold: 60000, // 60 seconds
        unit: 'ms',
        critical: false,
    },
};

export interface BenchmarkResult {
    target: string;
    value: number;
    passed: boolean;
    timestamp: Date;
    details?: Record<string, any>;
}

export function evaluateBenchmark(
    target: string,
    value: number,
): BenchmarkResult {
    const config = BENCHMARK_TARGETS[target];
    if (!config) {
        throw new Error(`Unknown benchmark target: ${target}`);
    }

    // For FPS and speed, higher is better
    // For time and memory, lower is better
    const higherIsBetter = ['fps', 'qps', 'speed', 'concurrent'].includes(config.metric);
    const passed = higherIsBetter
        ? value >= config.threshold
        : value <= config.threshold;

    return {
        target,
        value,
        passed,
        timestamp: new Date(),
    };
}
