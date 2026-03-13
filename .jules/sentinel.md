## 2024-03-13 - [Missing Authentication on Multiple Controllers]
**Vulnerability:** Several sensitive controllers in `apps/api/src/construction` (procurement, claim, submittal, construction) have the `@UseGuards(JwtAuthGuard)` commented out or completely missing.
**Learning:** This is a common pattern in this repository during early scaffolding. Controllers are built but authentication is deferred, leaving sensitive project endpoints open to unauthenticated access.
**Prevention:** We should establish a mandatory requirement or linting rule to ensure controllers expose endpoints conditionally and strictly use Guards unless explicitly marked as `@Public()`.
