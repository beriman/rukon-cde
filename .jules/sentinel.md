## 2024-05-22 - Path Traversal in File Uploads
**Vulnerability:** `FilesService.uploadSystemFile` used `path.join(..., file.originalname)` in local filesystem fallback, allowing directory traversal (e.g., `foo/../../evil.sh`) if the filename contained slashes.
**Learning:** Local filesystem fallbacks often miss the security sanitization present in cloud storage (S3) logic or require explicit `path.basename` usage which is easy to forget.
**Prevention:** Always use `path.basename()` on user-provided filenames before using them in filesystem operations. Ideally, generate random UUIDs for filenames on disk.
