## 2024-05-15 - Path Traversal bypass via path.join()

**Vulnerability:** Path Traversal via prepended constants
**Learning:** Prepending a timestamp or a UUID to an unsanitized user-supplied filename (e.g., `file.originalname`) does not prevent path traversal if the resulting string is passed into `path.join()`. When `path.join('/base/dir', '12345-../../../etc/passwd')` is called, it resolves to `/etc/passwd`. `path.join()` processes all directory separators, completely bypassing the intended directory confinement.
**Prevention:** Always sanitize the raw, user-supplied filename using `path.basename()` and restrict the allowed characters (e.g., stripping all non-alphanumeric/dot/dash characters) *before* prepending identifiers or manipulating it. Never assume prepended strings offer path traversal protection.
