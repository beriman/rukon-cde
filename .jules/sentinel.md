## 2026-02-06 - Path Traversal in Local Storage Fallback
**Vulnerability:** A Path Traversal vulnerability was found in `FilesService.uploadSystemFile` where unsanitized `originalname` and `subfolder` parameters allowed escaping the upload directory when using the local filesystem fallback (default when S3 is not configured).
**Learning:** Security controls often focus on the primary path (S3 keys) and neglect fallbacks (local FS). Even when S3 keys are safe with weird characters, local filesystems are not.
**Prevention:** Always sanitize filenames using `path.basename` and validate directory parameters against a strict allowlist (e.g., alphanumeric only) before using them in `path.join`, especially in fallback logic.
