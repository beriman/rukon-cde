## 2025-03-06 - Missing Authentication on Construction API Endpoints
**Vulnerability:** The `@UseGuards(JwtAuthGuard)` decorator was commented out on the `ConstructionController` and `SubmittalController` in `apps/api/src/construction/`.
**Learning:** This exposes sensitive project construction and submittal data, and allows unauthenticated creation/modification of work packages and submittals. This pattern of scaffolding controllers with commented-out guards is present in the codebase.
**Prevention:** Always verify that newly created controllers or scaffolded endpoints have authentication/authorization guards enabled before merging.
