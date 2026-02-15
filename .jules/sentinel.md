# Sentinel Journal

## 2024-05-22 - Authentication Bypass via Unverified OAuth Sync
**Vulnerability:** The `googleSync` endpoint allowed any user to authenticate as any other user simply by providing their email address in the request body. The endpoint did not verify the Google ID token or Access token.
**Learning:** Endpoints designed for "syncing" or "logging in" via OAuth must never trust the client-provided user information. They must verify the provider's token (ID Token or Access Token) directly with the provider or via a trusted signature verification process.
**Prevention:** Implemented strict token verification using Google's `tokeninfo` endpoint. The backend now requires a valid Google Access Token matching the claimed email address.
