## 2025-02-27 - [Path Traversal in File Upload Methods]
**Vulnerability:** Path traversal in file upload methods where user-provided inputs (`file.originalname` and `subfolder`) are used directly in file paths and S3 keys.
**Learning:** Prepending strings like timestamps to a user-provided filename does not prevent path traversal if the original filename contains directory separators and is processed by `path.join()`.
**Prevention:** Always sanitize the raw input using `path.basename()` before appending or manipulating it. In addition, validate or sanitize any user-provided string used as a directory using regex to remove relative paths like `../` and null bytes `\0`.
