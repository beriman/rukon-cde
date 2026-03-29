## 2024-05-22 - Path Traversal in File Upload
**Vulnerability:** Found a Path Traversal vulnerability in `FilesService.uploadSystemFile` where `file.originalname` was used directly in `path.join` with a directory. An attacker could construct a filename like `dummy/../../../../etc/passwd` to break out of the upload directory and overwrite system files (if permissions allow) or write files to arbitrary locations. The timestamp prefix `${timestamp}-` did not prevent this because the `../` sequences could just move up the tree from the prefixed directory name.

**Learning:** `path.join` resolves `..` segments. Even if you prefix a filename, if the filename itself contains path separators and parent directory references, `path.join` will honor them. Prefixes only help if they prevent the string from *starting* with `..` effectively, but `dir/../` negates the `dir` component.

**Prevention:** Always use `path.basename()` on user-supplied filenames before using them in filesystem operations. Never trust `file.originalname` or similar inputs to be just a filename.
