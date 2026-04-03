## 2025-04-03 - [Missing Authentication Guards on Scaffolded Controllers]
**Vulnerability:** Scaffolded and generated controllers in NestJS projects often miss explicit authentication guards, like `@UseGuards(JwtAuthGuard)`. Some controllers even have the guard lines commented out (e.g., `apps/api/src/construction/submittal.controller.ts`), exposing sensitive endpoints (like POST/PATCH methods) to unauthenticated users.
**Learning:** This occurs when standard scaffolding templates or quick copy-pasting is done without rigorous security review, leading to critical "Authentication Bypass" and "Insecure Direct Object Reference (IDOR)" vulnerabilities if endpoints rely on `req.user` when it's not populated or assume requests are trusted.
**Prevention:**
1. Always apply `@UseGuards(JwtAuthGuard)` to all new controllers by default unless an endpoint is intentionally public (using `@Public()`).
2. Use a linter rule (e.g., in ESLint) or a custom script during CI/CD to detect controllers lacking the `@UseGuards` decorator.
3. Include explicit testing for 401 Unauthorized responses on protected endpoints.
