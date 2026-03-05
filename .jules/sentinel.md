## 2024-11-06 - Missing Authentication on Scaffolded Controllers
**Vulnerability:** Several endpoints in the `construction` module (`construction.controller.ts`, `submittal.controller.ts`, `claim.controller.ts`, `procurement.controller.ts`) lacked authentication guards, leaving them publicly exposed despite the intention to restrict access. This occurred because `@UseGuards(JwtAuthGuard)` was either commented out or completely omitted during the initial controller scaffolding.
**Learning:** Scaffolded controllers in NestJS do not enforce authentication by default. Developers frequently comment out or forget to add the `JwtAuthGuard` during rapid development or scaffolding, leading to critical unauthorized access vulnerabilities in production.
**Prevention:**
1. Always enforce `JwtAuthGuard` globally or ensure every newly created controller explicitly requires it unless marked with a `@Public()` decorator.
2. Implement automated security linting rules or tests that scan for controllers missing authentication guards.
