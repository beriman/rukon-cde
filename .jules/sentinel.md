# Sentinel's Journal

## 2025-01-27 - [CRITICAL] Privilege Escalation in UsersController
**Vulnerability:** The `updateRole` and `deactivate` endpoints in `UsersController` were protected by `JwtAuthGuard` but lacked role-based authorization checks, allowing any authenticated user to elevate their privileges or deactivate other users.
**Learning:** `JwtAuthGuard` only verifies authentication (who you are), not authorization (what you can do). Explicit role checks or a `RolesGuard` are required for sensitive operations.
**Prevention:** Always apply `@Roles` (or equivalent authorization decorators) to endpoints that modify user permissions or status.
