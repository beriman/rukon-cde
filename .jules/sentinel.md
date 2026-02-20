## 2024-05-22 - Google Auth Bypass via Unverified Email
**Vulnerability:** The `google-sync` endpoint accepted an arbitrary email address in the request body and issued a valid JWT without verifying any OAuth token or signature. This allowed complete account takeover.
**Learning:** The backend relied implicitly on the frontend to perform authentication, without a corresponding server-side verification step. The hybrid auth architecture (Supabase on frontend, custom NestJS JWT on backend) created a gap where trust was misplaced.
**Prevention:** Always verify OAuth tokens (ID Token or Access Token) on the backend using the provider's public keys or introspection endpoints before trusting any identity claims. Never trust `email` or `user_id` from the client body for authentication.
