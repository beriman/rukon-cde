## 2025-02-14 - Fix Path Traversal Using Prepend
**Vulnerability:** Constructing a file path or S3 key by interpolating `file.originalname` directly inside a string (e.g. `` `${timestamp}-${file.originalname}` ``) without extracting its base name can lead to path traversal since directory paths in the payload (like `../../malicious_file`) are preserved.

**Learning:** Merely prepending a unique string to user-controlled filename input isn't a robust mitigation for path traversal. If `file.originalname` contains `../`, combining it with the rest of the string using `path.join` or even manually constructing the string can traverse out of the intended directory context.

**Prevention:** Always use `path.basename()` to securely extract only the intended file name, completely removing potential leading paths. Also sanitize output characters explicitly: `.replace(/[^a-zA-Z0-9.\-_]/g, '_')`.
