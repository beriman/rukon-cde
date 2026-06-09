## 2026-06-09 - [OAuth Authentication Bypass]
**Vulnerability:** The `/auth/google-sync` endpoint previously trusted the client-provided `email` without verifying the authenticity of the user. An attacker could potentially bypass authentication by providing an arbitrary email address.
**Learning:** Security checks for authentication must never rely on untrusted client-provided fields. When integrating with third-party OAuth providers, the backend must independently verify the user's identity.
**Prevention:** Unconditionally enforce token validation by verifying the external provider's JWT (e.g., Supabase JWT) and checking that the decoded claims (like email) match the requested user, rather than blindly trusting the client request.
