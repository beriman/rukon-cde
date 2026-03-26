## 2024-05-24 - [Controllers Missing Authentication Guards]
**Vulnerability:** Multiple controllers in the construction module (submittal, construction, procurement, claim, correspondence) were missing `@UseGuards(JwtAuthGuard)` or had it commented out, leaving their endpoints completely exposed and unauthenticated.
**Learning:** During scaffolding, authentication guards are often commented out or omitted entirely for ease of local development and may never be added back in before code merges to production.
**Prevention:** Always verify that every controller has an active authentication guard (e.g. `@UseGuards(JwtAuthGuard)`) before submitting changes.
