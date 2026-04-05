## 2024-04-05 - Missing Authentication on Scaffolded Controllers
**Vulnerability:** Multiple controllers in `apps/api/src/construction` (ConstructionController, SubmittalController) had missing or commented-out authentication guards (`@UseGuards(JwtAuthGuard)`).
**Learning:** Controllers generated via scaffolding may have authentication guards commented out or missing by default, leaving sensitive endpoints exposed.
**Prevention:** Always verify that authentication guards are active on new and modified controllers, and prefer using the custom `JwtAuthGuard` over `@nestjs/passport` `AuthGuard('jwt')` to support `@Public()` overrides.
