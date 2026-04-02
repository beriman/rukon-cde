## 2024-05-24 - Missing Authentication Guards on Sensitive Controllers

**Vulnerability:**
Several newly added controllers, notably `ClaimController` (`apps/api/src/construction/claim.controller.ts`) which handles sensitive financial claims and variation orders, were exposed without requiring authentication.

**Learning:**
Controllers generated via scaffolding tools or created manually in NestJS do not enforce authentication by default. This leads to insecure by default behavior, leaving sensitive endpoints exposed unless developers explicitly add the `@UseGuards(JwtAuthGuard)` decorator.

**Prevention:**
Always verify that authentication guards are active on all new and modified controllers, particularly those handling sensitive business logic or user data, during code reviews and security audits.
