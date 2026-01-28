## 2024-05-23 - [Privilege Escalation in UsersController]
**Vulnerability:** Any authenticated user could update any user's role (including their own) to SUPER_ADMIN or deactivate any user via `UsersController.updateRole` and `UsersController.deactivate`.
**Learning:** The `JwtAuthGuard` only ensures authentication, not authorization. Explicit role checks or a RolesGuard are required for administrative endpoints.
**Prevention:** Always verify `currentUser.role` or use a dedicated `@Roles()` guard on sensitive endpoints.
