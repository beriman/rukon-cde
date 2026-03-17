
## 2024-05-27 - Scaffolded Controllers Missing Authentication
**Vulnerability:** Found multiple scaffolded controllers (like `ClaimController`, `ProcurementController`, `ClassificationController`) lacking default authentication. This left sensitive endpoints unprotected, creating a risk of unauthorized data access and modification.
**Learning:** In this NestJS application, the `@UseGuards(JwtAuthGuard)` decorator is not applied globally by default. Newly generated or scaffolded controllers may omit it, either through accidental oversight or by leaving scaffolded comments active without implementing the guard.
**Prevention:** Always verify that newly created or modified controllers and their sensitive endpoints include explicit authentication/authorization guards, specifically `@UseGuards(JwtAuthGuard)` imported from `../auth/guards/jwt-auth.guard`, unless explicitly intended to be public.
