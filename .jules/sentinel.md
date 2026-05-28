
## 2024-05-28 - Path Traversal Vulnerability in File Uploads
**Vulnerability:** Untrusted user input (`file.originalname`) and `subfolder` paths were directly concatenated into file storage paths and S3 keys in `FilesService.uploadSystemFile` and `SiteCaptureService.create`, leading to potential path traversal vulnerabilities.
**Learning:** Even when uploading to S3, insecure file keys can lead to unintended overwrites or logical vulnerabilities. Locally, this can allow arbitrary file writes.
**Prevention:** Always sanitize `file.originalname` with `path.basename` and regex (`.replace(/[^a-zA-Z0-9.\-_]/g, '_')`) and validate custom path segments (like `subfolder`) by ensuring they do not contain directory traversal sequences like `..` or `\0`.
