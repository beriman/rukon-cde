## 2025-04-15 - Path Traversal via Unsanitized `file.originalname`
**Vulnerability:** Path Traversal
**Learning:** `file.originalname` is directly used in file path construction for local and S3 uploads in `files.service.ts` and `site-capture.service.ts`. Attackers could use malicious filenames like `../../../etc/passwd` to overwrite server files or escape intended S3 namespaces.
**Prevention:** Always sanitize `file.originalname` using `path.basename()` before using it. Also validate intermediate paths like `subfolder` to ensure they do not contain directory traversal characters like `..` or null bytes `\0`.
