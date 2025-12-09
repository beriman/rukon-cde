// k6 Load Testing Script for File Upload
// Story 1.26: Load Testing Infrastructure

import http from 'k6/http';
import { check, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

export const options = {
    stages: [
        { duration: '1m', target: 100 },  // Ramp up to 100 users
        { duration: '3m', target: 100 },  // Stay at 100 users for 3 minutes
        { duration: '1m', target: 0 },    // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000'], // 95% of requests must complete below 3s
        http_req_failed: ['rate<0.01'],    // Error rate must be below 1%
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
    // Login to get JWT token
    const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
        email: 'testuser@example.com',
        password: 'Test1234!',
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, {
        'login successful': (r) => r.status === 200,
    });

    const token = loginRes.json('access_token');

    if (!token) {
        console.error('Failed to get authentication token');
        return;
    }

    // Prepare file upload
    const formData = new FormData();

    // Generate test file data (1MB)
    const fileData = 'A'.repeat(1024 * 1024);
    formData.append('file', http.file(fileData, 'TEST-ARC-A-01-DR-A-001.pdf', 'application/pdf'));
    formData.append('folderId', 'test-folder-id');

    // Upload file
    const uploadRes = http.post(`${BASE_URL}/api/files/upload`, formData.body(), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/form-data; boundary=${formData.boundary}`,
        },
    });

    check(uploadRes, {
        'upload successful': (r) => r.status === 201,
        'response time < 3s': (r) => r.timings.duration < 3000,
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        'load-test-results.html': htmlReport(data),
        'load-test-results.json': JSON.stringify(data),
    };
}
