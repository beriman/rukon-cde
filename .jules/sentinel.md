## 2024-03-08 - Added Missing Authentication Guards to Construction Endpoints
**Vulnerability:** Several sensitive endpoints in the `construction` module (`ClaimController`, `ConstructionController`, `ProcurementController`, `SubmittalController`) lacked authentication because `@UseGuards(JwtAuthGuard)` was commented out or completely missing.
**Learning:** Controllers generated during scaffolding often have authentication guards commented out to speed up initial development, but these are easily forgotten, leaving endpoints exposed in production.
**Prevention:** Always verify that newly created controllers or modified controllers have the `@UseGuards(JwtAuthGuard)` decorator applied and active unless explicitly designed to be public.
