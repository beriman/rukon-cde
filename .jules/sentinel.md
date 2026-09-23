## 2026-08-08 - Path Traversal via Unsanitized S3 Keys
**Vulnerability:** Path traversal vulnerability exists because `file.originalname` and `subfolder` are used directly in file paths and S3 keys without sanitization.
**Learning:** Prepending strings or folders does not prevent path traversal if the original filename or subfolder variables contain directory separators.
**Prevention:** Always sanitize raw input using `path.basename` and validate parameters like `subfolder` before utilizing them in file paths or S3 keys.
