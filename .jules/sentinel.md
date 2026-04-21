## 2024-03-22 - Path Traversal Vulnerability in File Uploads

**Vulnerability:** Found unsanitized usage of `file.originalname` and `subfolder` parameters in S3 key generation and local filesystem path construction within `FilesService.uploadSystemFile` and `SiteCaptureService.create`.
**Learning:** Treating multipart form data's `originalname` property as trusted input allows attackers to manipulate upload destinations (e.g., using `../../../malicious.js` as a filename) enabling directory traversal / arbitrary file writes. Similarly, unsanitized `subfolder` parameters can lead to unintended directory structures.
**Prevention:** Always sanitize user-provided file names using `path.basename` to extract only the actual file name, stripping any directory sequences. Additionally, apply strict sanitization (e.g., removing backslashes, `../`, and leading slashes) or strict validation against allowed values for any dynamic directory structure derived from user input.
