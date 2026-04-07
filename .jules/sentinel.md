## 2024-06-25 - [Path Traversal in File Uploads]
**Vulnerability:** File upload endpoints (like `uploadSystemFile` and `SiteCaptureService.create`) used `file.originalname` directly without sanitization, and `uploadSystemFile` used an unvalidated `subfolder` string, allowing an attacker to overwrite arbitrary files using payloads like `../../../filename.txt` in the subfolder or original filename.
**Learning:** Never trust the `originalname` or user-controlled folder names provided in file upload multipart form data.
**Prevention:** Always sanitize the filename using `path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '')` and validate dynamic subfolders with a strict regex (e.g. `/^[a-zA-Z0-9_-]+$/`).
