## 2024-05-23 - Backend Trusting Client Email for OAuth Sync
**Vulnerability:** `AuthService.googleSync` accepted an email and name without any verification, allowing account takeover by simply POSTing an email address to the endpoint.
**Learning:** The developers likely assumed the endpoint was internal to the frontend's OAuth flow and didn't realize it was a public API endpoint that could be bypassed. Relying on the client to perform security checks (OAuth) and just reporting the result (email) to the backend is insecure.
**Prevention:** Always verify authentication tokens (ID tokens or Access tokens) on the backend using the provider's verification endpoints or public keys. Never accept user identity claims from the client without cryptographic proof.
