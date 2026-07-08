
## 2024-07-08 - Path Traversal in File Upload mechanisms
**Vulnerability:** User-controlled filenames (`file.originalname`) and subfolder paths were concatenated into S3 object keys and local file paths without any sanitization in `FilesService` and `SiteCaptureService`.
**Learning:** Even if UUIDs or timestamps are prepended to filenames, path traversal attacks (like `../../../etc/passwd`) are still possible if the underlying engine processes directory separators.
**Prevention:** Always extract the base name of untrusted file inputs using `path.basename()` and further strip potentially harmful characters before reassigning it to be processed in file paths or keys. Additionally, reject any paths or subfolders explicitly containing `..` or null bytes `\0`.
