## 2024-04-18 - [Path Traversal in File Uploads]
**Vulnerability:** File upload methods (`FilesService.uploadSystemFile` and `SiteCaptureService.create`) used user-controlled `file.originalname` directly to construct S3 keys and local directory paths without any sanitization.
**Learning:** Even internal API inputs mapped to S3 or internal file operations are prone to Path Traversal if unsanitized. Specifically, an original filename like `../../../../root_dir` could escape the intended directory or prefix.
**Prevention:** Always use `path.basename()` to strip file paths from `file.originalname` or any user-supplied filename parameter before generating storage locations. Add checks to reject `..` and null bytes (`\0`) in dynamic subfolder parameters.
