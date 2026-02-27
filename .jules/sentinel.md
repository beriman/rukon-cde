## 2024-05-24 - [CRITICAL] Path Traversal in File Upload
**Vulnerability:** The `uploadSystemFile` method in `FilesService` accepted a `subfolder` argument and `file.originalname` without validation, allowing attackers to write files to arbitrary locations on the filesystem (e.g., `../../malicious.exe`) using path traversal characters.
**Learning:** Even internal or "system" upload methods must strictly validate all path components derived from user input or external sources. Relying on the assumption that a parameter is "safe" because it's not directly exposed in the main controller is dangerous if the service method is reused or inputs are not sanitized.
**Prevention:**
1. Validated `subfolder` against a strict allowlist regex (`/^[a-zA-Z0-9_-]+$/`).
2. Sanitized `file.originalname` using `path.basename()` to strip any directory components.
3. Added a dedicated regression test `files-path-traversal.spec.ts` to verify these controls.
