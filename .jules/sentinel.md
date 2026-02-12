## 2024-05-23 - [Path Traversal in System Uploads]
**Vulnerability:** Path traversal in `uploadSystemFile` via unsanitized `subfolder` and `file.originalname` allowed writing files outside the intended directory.
**Learning:** Secondary upload paths (like system files) often bypass strict validations applied to primary workflows (like ISO 19650 files), creating hidden vulnerabilities.
**Prevention:** Always apply input sanitization to file system operations, even in internal/admin helper methods. Use `path.basename` and whitelist validation for directory names.
