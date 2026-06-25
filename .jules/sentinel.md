## 2024-05-30 - Path Traversal in File Upload
**Vulnerability:** User-controlled filenames (`file.originalname`) used directly in `path.join()` without sanitization in local file fallback handlers.
**Learning:** Prepending a timestamp or UUID to an unsanitized filename does not prevent path traversal if the filename contains directory separators (e.g. `../`) and is processed by `path.join()`. Also affects S3 keys which shouldn't have arbitrary traversal.
**Prevention:** Always extract the base filename using `path.basename()` and strip illegal characters before using it in file paths or S3 keys.
