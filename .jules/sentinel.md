## 2024-05-23 - [CRITICAL] Path Traversal in File Uploads
**Vulnerability:** The `FilesService.uploadSystemFile` method allowed path traversal via `subfolder` and `file.originalname` parameters when using local storage fallback.
**Learning:** Even internal service methods should validate inputs, as they might be exposed via other controllers or future changes. `path.join` does not prevent traversal if input contains `..` segments that are not neutralized by the join root.
**Prevention:** Always validate directory names against a whitelist (e.g., alphanumeric) and use `path.basename` to sanitize filenames before using them in filesystem operations.
