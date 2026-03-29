## 2024-05-20 - Unsanitized originalname causing path traversal

**Vulnerability:** The application was using `file.originalname` from multipart form-data directly in string interpolation to generate S3 keys and local file system paths (e.g., `apps/api/src/files/files.service.ts` and `apps/api/src/site-capture/site-capture.service.ts`). This is a Path Traversal vulnerability because an attacker can supply filenames containing directory traversal characters (like `../`) which could result in arbitrary file overwrites or unauthorized file access in local storage, and confusing key structures in S3.

**Learning:** S3 key structures and local file system interactions built using raw user input are extremely vulnerable. In Express apps handling files, `originalname` is entirely user-controlled and must never be trusted.

**Prevention:** Always sanitize the filename before using it in any system operation. A common pattern is to use `path.basename(file.originalname)` to strip directory paths and then use a regular expression (like `.replace(/[^a-zA-Z0-9.\-_]/g, '_')`) to remove any remaining potentially problematic characters.
