## 2025-02-14 - Authentication Bypass in Google Sync
**Vulnerability:** The `/auth/google-sync` endpoint accepted user email without verifying any cryptographic proof of identity (like an OAuth token or JWT signature). An attacker could impersonate any user simply by sending their email in the request payload.
**Learning:** Security checks for authentication must never rely solely on untrusted client-provided fields. OAuth flows typically provide a token that must be validated on the backend.
**Prevention:** When using Supabase to normalize OAuth, unconditionally enforce token validation by verifying the Supabase JWT (`access_token`) via `jwtService.verifyAsync` and checking that the decoded email matches the requested email.
