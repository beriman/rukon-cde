## 2024-08-09 - Path Traversal in File Uploads
**Vulnerability:** User-provided filename and subfolder paths were used in local directory construction and S3 keys without sanitization, leading to path traversal vulnerabilities.
**Learning:** Relying on prepended UUIDs or timestamps does not prevent path traversal if the original filename is processed by path manipulation tools.
**Prevention:** Always sanitize filenames using path.basename() and replace unsafe characters. Validate subfolder paths strictly to reject traversal characters.
