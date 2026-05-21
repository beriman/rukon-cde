
## 2024-05-21 - Authentication Bypass in OAuth Sync Endpoint
**Vulnerability:** The `/auth/google-sync` endpoint accepted an unverified email address from the frontend and blindly generated a valid application JWT for that user. It lacked token validation, allowing anyone to impersonate any user by just POSTing their email.
**Learning:** When using an external identity provider (like Supabase or Google) on the frontend and syncing it to a custom backend to issue local tokens, the backend must verify the identity provider's token. Trusting client-provided claims (like email) directly without cryptographic verification is a fatal Confused Deputy / Auth Bypass vulnerability.
**Prevention:** Always require and verify the original OAuth/OIDC token (e.g., via `jwtService.verifyAsync`) on backend sync endpoints, and ensure the decoded token's claims (like `email`) match the requested user.
