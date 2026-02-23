# Sentinel's Journal

## 2025-02-23 - Critical Authentication Bypass in Google Sync
**Vulnerability:** The `google-sync` endpoint accepted an arbitrary email address in the request body and logged the user in without verifying ownership of that email. This allowed full account takeover.
**Learning:** OAuth integrations often require a backend verification step (using an ID token or Access Token) to ensure the request is legitimate. Trusting client-side data for authentication is dangerous.
**Prevention:** Always verify identity tokens on the server side using the provider's public keys or verification endpoint before trusting the user identity.
