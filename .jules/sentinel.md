## 2024-05-24 - Path Traversal in File Uploads
**Vulnerability:** Path traversal vulnerability in `FilesService` via `file.originalname` and `subfolder` parameters.
**Learning:** In Node.js, appending untrusted strings (even when prefixed) to paths or S3 keys allows directory traversal. `path.join()` resolves `..`, meaning a filename like `../../../etc/passwd` can escape intended directories. In S3, `../` can overwrite arbitrary objects.
**Prevention:** Always sanitize `file.originalname` using `path.basename()` and restrict allowed characters before using it. Validate `subfolder` inputs by explicitly rejecting `..` and `\0` characters. Reassign the sanitized value back to `file.originalname` so downstream services inherit the safety.
