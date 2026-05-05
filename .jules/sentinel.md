## 2024-05-24 - Path Traversal in File Upload Methods
**Vulnerability:** Path traversal vulnerability exists due to unsanitized `file.originalname` and `subfolder` arguments used directly to construct S3 keys and local file paths in `uploadSystemFile` (`files.service.ts`) and `create` (`site-capture.service.ts`).
**Learning:** Even when appending random strings or timestamps, an unsanitized `originalname` (`../../etc/passwd`) or `subfolder` can escape the intended directory, especially when using a local filesystem fallback or manipulating object keys in S3.
**Prevention:** Always sanitize `file.originalname` using `path.basename(file.originalname)` and explicitly sanitize user-provided subfolder strings by removing `../` sequences.
