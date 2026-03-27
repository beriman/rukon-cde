## 2026-02-18 - Google OAuth Authentication Bypass
**Vulnerability:** The `googleSync` endpoint trusted the client-provided email address to log users in, allowing full account takeover by simply sending a POST request with the target email.
**Learning:** The implementation treated the Supabase session as a trusted source for syncing, but the endpoint was public and lacked server-side token verification. It assumed the client was honest.
**Prevention:** Always verify OAuth tokens on the server side using the provider's validation endpoint (e.g., `https://www.googleapis.com/oauth2/v3/userinfo`) before trusting any user identity claims. Never rely on client-provided user data for authentication.
