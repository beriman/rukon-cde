# Sentinel Journal

## 2025-02-14 - Path Traversal in File Upload
**Vulnerability:** The `FilesService.uploadSystemFile` method in `apps/api` allowed path traversal via unvalidated `subfolder` argument and unsanitized `file.originalname`, enabling arbitrary file write in local storage mode.
**Learning:** Local filesystem fallbacks in cloud-native apps often lack the security controls inherent to object storage (like S3), becoming a weak point if not rigorously validated.
**Prevention:** Always sanitize filenames using `path.basename()` and validate directory parameters against a strict allowlist regex (e.g., `^[a-zA-Z0-9_-]+$`) before using them in file paths.
