# Sentinel's Journal

## 2024-05-23 - Missing Role-Based Access Control on Critical Endpoints
**Vulnerability:** Critical privilege escalation vulnerability in `UsersController`. `updateRole` and `deactivate` endpoints were protected only by `JwtAuthGuard` (authentication), allowing any logged-in user to promote themselves to SUPER_ADMIN or deactivate other users.
**Learning:** The application had `GlobalRole` enum and `JwtStrategy` returning roles, but lacked a mechanism (`RolesGuard`) to enforce them. Developers likely assumed `JwtAuthGuard` provided sufficient protection or forgot to implement authorization.
**Prevention:**
1.  Always implement and enforce RBAC for administrative endpoints.
2.  Use a custom `RolesGuard` in conjunction with `JwtAuthGuard`.
3.  Audit all controllers for missing authorization checks, especially `POST`, `PATCH`, `DELETE` methods.
