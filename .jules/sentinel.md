## 2023-10-25 - Auth Bypass Vulnerability in googleSync Endpoint
**Vulnerability:** The `/auth/google-sync` endpoint accepted arbitrary email addresses and signed users in or auto-registered them without verifying the authenticity of the request via a token from the identity provider (Google).
**Learning:** OAuth integrations that rely on a client-side callback passing user details directly to a backend API are vulnerable to Confused Deputy and authentication bypass attacks unless the backend explicitly verifies the provider's token.
**Prevention:** Always require and validate the provider token (e.g., using Google's `tokeninfo` API) on the server side, verifying the token's audience (`aud`), `email`, and `email_verified` status before issuing session tokens.
