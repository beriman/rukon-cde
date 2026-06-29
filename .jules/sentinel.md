
## 2024-05-24 - Critical Authentication Bypass in OAuth Sync
**Vulnerability:** The `/auth/google-sync` backend endpoint was completely trusting the client to provide `email` and `name` without any proof of successful OAuth authentication. This allowed any user or attacker to bypass authentication entirely by making a POST request with any user's email address and receiving valid access tokens for that user.
**Learning:** Never trust the client for identity claims in OAuth flows. Simply receiving an email from a client after a callback is not secure, even if the frontend verifies it.
**Prevention:** Always require and verify an identity token (`providerToken`) on the backend. When using Supabase to manage OAuth, send the Supabase `access_token` to the backend and verify it using `jwtService.verifyAsync` with the appropriate secret (`SUPABASE_JWT_SECRET` or `JWT_SECRET`). Ensure the verified token's claims match the requested identity.
