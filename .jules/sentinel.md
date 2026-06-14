
## 2024-05-24 - Path Traversal in File Uploads
**Vulnerability:** Path traversal vulnerability in `FilesService.uploadSystemFile` and `SiteCaptureService.create` allowing attackers to upload files to arbitrary locations by injecting `../` in `file.originalname` or `subfolder`.
**Learning:** Using raw `file.originalname` from multi-part file uploads directly in `path.join()` or S3 `Key` generation is a high-severity risk. Even in a modern NestJS codebase, Node core path operations must sanitize input, as prepending timestamps or static path prefixes does not neutralize directory traversal characters.
**Prevention:** Always extract the basename using `path.basename(file.originalname)`, replace unsafe characters using regex (e.g. `.replace(/[^a-zA-Z0-9.\-_]/g, '_')`), and explicitly validate user-controlled subdirectory variables (like `subfolder`) by rejecting `..` and null bytes (`\0`).
