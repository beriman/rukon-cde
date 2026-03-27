## 2024-05-23 - Path Traversal in FilesService
**Vulnerability:** `FilesService.uploadSystemFile` used `path.join` with unsanitized `file.originalname` and user-controlled `subfolder`.
**Learning:** `path.join` does not protect against directory traversal (`../`) if arguments contain it.
**Prevention:** Always use `path.basename()` on user-provided filenames and whitelist validation on folder names.

## 2024-05-23 - Google OAuth Authentication Bypass (Identified)
**Vulnerability:** `AuthService.googleSync` blindly trusts `email` and `name` from request body without validating ID token.
**Learning:** Accepting user identity claims from client without cryptographic verification allows account takeover.
**Prevention:** Verify ID tokens using provider's public keys or SDK before creating sessions.
