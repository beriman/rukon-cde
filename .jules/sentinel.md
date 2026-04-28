
## 2024-04-28 - [CRITICAL] Prevent Path Traversal in File Uploads
**Vulnerability:** Found `file.originalname` and subfolder parameters being used directly to construct file paths and S3 keys without sanitization in `FilesService` and `SiteCaptureService`. This allows malicious users to perform path traversal attacks (e.g. by using payloads like `../../../etc/passwd` or `../.env` as the filename) which can write to unintended locations.
**Learning:** In a NestJS or Node context, it's easy to trust `.originalname` from `multer` but it is completely user-controlled. Also, when saving to local filesystem fallback or S3, traversing directories is a critical issue that can either overwrite arbitrary files (in local fs) or escape intended S3 prefixes.
**Prevention:** Always sanitize user-provided file names using `path.basename(file.originalname)` and explicitly strip path traversal sequences (`..`, leading slashes) from any user-controlled subfolder parameter.
