const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://127.0.0.1:3001';
const TEST_EMAIL = `audit-test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'Password123!';
const TEST_ORG_NAME = `Audit Org ${Date.now()}`;
const TEST_PROJECT_NAME = `Audit Project ${Date.now()}`;
const TEST_PROJECT_CODE = `AP-${Date.now().toString().substr(-4)}`;

async function runTest() {
    console.log('🚀 Starting Phase 2 Verification Script...');
    let token = '';
    let userId = '';
    let orgId = '';
    let projectId = '';
    let activeFolderId = '';
    let fileId = '';

    try {
        // 1. Register
        console.log('\n[1] Registering User...');
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                confirmPassword: TEST_PASSWORD,
                name: 'Audit Tester'
            });
            console.log('✅ Registered:', regRes.data.user.email);
            userId = regRes.data.user.id;
        } catch (e) {
            if (e.response?.status === 409) {
                console.log('User exists, logging in...');
            } else {
                throw e;
            }
        }

        // 2. Login
        console.log('\n[2] Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        token = loginRes.data.access_token;
        if (!userId) userId = loginRes.data.user.id;
        console.log('✅ Logged in. Token received.');

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // 3. Create Organization
        console.log('\n[3] Creating Organization...');
        const orgRes = await axios.post(`${API_URL}/organizations`, {
            name: TEST_ORG_NAME
        }, authHeader);
        orgId = orgRes.data.id;
        console.log('✅ Organization Created:', orgId);

        // 4. Create Project
        console.log('\n[4] Creating Project...');
        const projRes = await axios.post(`${API_URL}/projects`, {
            name: TEST_PROJECT_NAME,
            code: TEST_PROJECT_CODE,
            organizationId: orgId
        }, authHeader);
        projectId = projRes.data.id;
        console.log('✅ Project Created:', projectId);

        // 5. Get Project Root Folder (Project creation automatically creates "Project Information" or similar?) 
        // Or we might need to create one. Let's see what folders exist.
        const foldersRes = await axios.get(`${API_URL}/projects/${projectId}/folders`, authHeader);
        // Assuming the first one is suitable or create one
        let folderId;
        if (foldersRes.data && foldersRes.data.length > 0) {
            folderId = foldersRes.data[0].id; // Use root folder often created by default or empty list?
            // If empty, create one
        }

        if (!folderId || foldersRes.data.length === 0) {
            const folderRes = await axios.post(`${API_URL}/projects/${projectId}/folders`, {
                name: 'WIP Folder',
                parentId: null
            }, authHeader);
            folderId = folderRes.data.id;
        }
        activeFolderId = folderId;
        console.log('✅ Target Folder ID:', activeFolderId);

        // 6. Upload File
        console.log('\n[6] Uploading File (WIP)...');
        // Create a dummy file
        const dummyFilePath = path.join(__dirname, 'test-file.txt');
        fs.writeFileSync(dummyFilePath, 'This is a test file for CDE Audit.');

        const form = new FormData();
        form.append('file', fs.createReadStream(dummyFilePath));
        form.append('folderId', activeFolderId);

        const uploadRes = await axios.post(`${API_URL}/projects/${projectId}/files/upload`, form, {
            headers: {
                ...authHeader.headers,
                ...form.getHeaders()
            }
        });
        fileId = uploadRes.data.id;
        console.log('✅ File Uploaded:', fileId);
        console.log('   State:', uploadRes.data.cdeState); // Should be WIP

        // 7. Promote to SHARED
        console.log('\n[7] Promoting to SHARED...');
        const promoteRes = await axios.post(`${API_URL}/projects/${projectId}/files/${fileId}/promote`, {}, authHeader);
        console.log('✅ Promoted:', promoteRes.data.message);
        console.log('   New State:', promoteRes.data.file.cdeState); // Should be SHARED

        // 8. Publish to PUBLISHED
        console.log('\n[8] Publishing to PUBLISHED...');
        const publishRes = await axios.post(`${API_URL}/projects/${projectId}/files/${fileId}/publish`, {}, authHeader);
        console.log('✅ Published:', publishRes.data.message);
        console.log('   New State:', publishRes.data.file.cdeState); // Should be PUBLISHED

        // 9. Logout
        console.log('\n[9] Logging out...');
        await axios.post(`${API_URL}/auth/logout`, {}, authHeader);
        console.log('✅ Logged out.');

        console.log('\n🎉 Verification Script Completed Successfully!');
        console.log(`\nNow, run this SQL via MCP to verify Audit Logs:\nSELECT * FROM "audit_logs" WHERE "userId" = '${userId}' ORDER BY "createdAt" DESC;`);

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.code) console.error('   Code:', error.code);
        if (error.response) console.error('   Response:', JSON.stringify(error.response.data, null, 2));
        if (error.config) console.error(`   Endpoint: ${error.config.method} ${error.config.url}`);
    } finally {
        // Cleanup temp file
        try {
            if (fs.existsSync(path.join(__dirname, 'test-file.txt'))) {
                fs.unlinkSync(path.join(__dirname, 'test-file.txt'));
            }
        } catch { }
    }
}

runTest();
