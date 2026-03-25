
## 2024-05-18 - [Missing Authentication in Scaffolding]
**Vulnerability:** Multiple controllers in the `construction` module (`SubmittalController`, `ConstructionController`, `ProcurementController`, `ClaimController`, `CorrespondenceController`) lacked `@UseGuards(JwtAuthGuard)` decorators (often leaving them commented out from initial scaffold code), effectively leaving sensitive endpoint routes completely exposed to unauthenticated users.
**Learning:** Scaffolding defaults frequently leave placeholder or commented-out decorators as "to-do" items, causing critical endpoints to remain unprotected in production.
**Prevention:** Always verify and enforce authentication guards on all new and existing controller endpoints, and implement automated tests or linting rules to flag controllers without a `@UseGuards` or `@Public` decorator.
