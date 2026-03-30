## 2026-02-24 - [Critical] Google OAuth Bypass
**Vulnerability:** The `googleSync` endpoint accepted `email` in the body and logged users in without verifying any token.
**Learning:** Never trust client-provided identity data. Always verify ID tokens or Access Tokens with the provider.
**Prevention:** Implement server-side token verification (e.g. `tokeninfo`) before trusting user identity.
