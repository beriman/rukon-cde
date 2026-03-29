## 2024-05-22 - Google Auth Bypass via Unverified Email Sync
**Vulnerability:** The `googleSync` endpoint in `AuthService` trusted the `email` provided in the request body without verifying any OAuth token. This allowed attackers to log in as any user by simply knowing their email address.
**Learning:** Custom "sync" or "link account" endpoints that bridge frontend auth (like Supabase/Firebase) with backend logic are often weak points if they don't re-verify the provider's token server-side.
**Prevention:** Always require and verify the Identity Provider's access token or ID token on the backend before trusting any identity claims (email, sub) from the frontend.
