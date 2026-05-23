## 2024-05-15 - [Path Traversal via Unsanitized Subfolder & OriginalName during Uploads]
**Vulnerability:** The `FilesService.uploadSystemFile` method contained a critical path traversal vulnerability because it concatenated user-provided `subfolder` strings and `file.originalname` properties directly into both S3 keys and local file system paths (`path.join`) without prior sanitization. This allowed attackers to escape intended directories and potentially read/write arbitrary files using payloads like `../../`.

**Learning:** When using `path.join()`, any un-sanitized user input containing directory separators (e.g., `/` or `\`) can enable directory traversal, even if a prefix or timestamp is prepended to the string. Sanitizing these inputs requires careful consideration of the order of operations to avoid bypasses using mixed slashes or null bytes. Furthermore, prepending identifiers (like `timestamp-`) to filenames does not mitigate the risk if the original filename still contains path traversal payloads.

**Prevention:** Always sanitize both filenames and subfolder paths provided by users before incorporating them into file operations or S3 keys.
- For filenames: Extract the pure filename using `path.basename(file.originalname)`, followed by a strict regex replacement (e.g., `.replace(/[^a-zA-Z0-9.\-_]/g, '_')`) to strip invalid characters.
- For subfolder paths: Ensure a strict order of sanitization operations:
  1. Replace backslashes with forward slashes (`.replace(/\\/g, '/')`).
  2. Strip null bytes (`.replace(/\0/g, '')`).
  3. Strip `../` sequences (`.replace(/(^|\/)\.\.(?=\/|$)/g, '')`).
  4. Remove leading slashes (`.replace(/^\/+/, '')`).
- Ensure core modules like `fs` and `path` are imported securely at the top level using ES6 imports instead of inline `require()`.
