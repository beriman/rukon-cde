## 2024-05-24 - Path Traversal in File Uploads
**Vulnerability:** Unsanitized `file.originalname` in `files.service.ts` and `site-capture.service.ts` allowed path traversal when constructing local file paths and S3 keys.
**Learning:** Even when using S3, user-provided filenames must be sanitized because object keys can include directory separators (`/`), potentially allowing arbitrary object overwrites or bypassing folder structures. In Node.js, simply appending an ID does not prevent path traversal if the original name contains directory characters.
**Prevention:** Always sanitize the raw input using `path.basename()` and regex replacement to remove unsafe characters immediately at the beginning of the upload handling function before any further validation or downstream usage.
