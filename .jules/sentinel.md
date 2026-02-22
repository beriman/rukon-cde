## 2024-05-23 - Google Auth Bypass Fix
**Vulnerability:** The `googleSync` endpoint in `AuthService` accepted an email address from the client and logged the user in without verifying any token. This allowed full account takeover by simply sending a POST request with a target email.
**Learning:** Trusting client-side authentication results (like an email string) without backend verification is a critical security flaw. Even if the frontend code seems secure, the API endpoint must enforce its own security checks.
**Prevention:** Backend services must always verify OAuth tokens (ID tokens or Access Tokens) using the provider's public keys or introspection endpoints before trusting the identity claims.
