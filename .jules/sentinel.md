## 2024-05-22 - Missing RBAC in User Management
**Vulnerability:** The `UsersController` exposed `updateRole` and `deactivate` endpoints without any Role-Based Access Control (RBAC). Any authenticated user (including regular users) could escalate their privileges to `SUPER_ADMIN` or deactivate other users.
**Learning:** The application relied solely on `JwtAuthGuard` for authentication but lacked a mechanism to enforce authorization based on roles. The `@Roles` decorator and `RolesGuard` were missing entirely.
**Prevention:**
1. Always implement both Authentication (`JwtAuthGuard`) and Authorization (`RolesGuard`) for sensitive endpoints.
2. Use a custom `@Roles` decorator to explicitly define required roles.
3. Apply `RolesGuard` globally or on controllers that handle sensitive data.
