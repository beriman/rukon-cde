---
title: "Phase 0 Repository and Architecture Audit"
author: Beriman Juliano
project: Ruang Konstruksi
status: active
updated: 2026-09-20
---

# Phase 0 Repository and Architecture Audit

## Scope and evidence

Reviewed root guidance, strategy/architecture documents, contractor PRD, Next.js and NestJS applications, Docker/infra definitions, Prisma schema/migrations, tests, and environment examples. The supplied prototype file was not present in the repository or accessible filesystem. Prototype findings are therefore limited to the workflow inventory in the product brief and must be validated against the actual HTML before visual implementation.

## A. Existing architecture

- npm/Turborepo monorepo: Next.js 14 React/TypeScript web client plus NestJS/Prisma API.
- One large shared PostgreSQL schema spans CDE, planning, construction, HSE, BIM, AI, and reporting. Docker Compose runs PostgreSQL, API, web, and a Python BITL service.
- Authentication is split: the API issues custom JWTs while parts of the web initialize Supabase Auth. File services primarily use S3/local-disk patterns.
- UI assets include dashboards, project/document surfaces, common components, PDF/BIM-related shells, and mobile-oriented features.

## B. Implementation maturity

This is a broad functional prototype with many modules and tests, but not a production-safe vertical slice. Build/test/CI baselines have drifted; migration history does not establish the full schema; authorization is inconsistent; and integrations are partial or mocked. A screen or service is not evidence of production readiness.

## C. Reusable parts

- Next.js/NestJS boundaries, Prisma service, DTO/validation conventions, common UI primitives, dashboard shell, and document/viewer shells.
- Organization, project, folder, file-version, and audit concepts can inform migration/backfill even where semantics require correction.
- Existing unit/E2E suites are regression candidates and should be classified, not discarded.
- Naming, PDF, notification, and conversion services can sit behind hardened ports after authorization and failure behavior are tested.

## D. Conflicting or obsolete assumptions

| Existing assumption | Current direction |
|---|---|
| Database-per-tenant in legacy architecture | Shared Supabase PostgreSQL with organization/project RLS |
| AWS-first infrastructure and S3/local fallback | Supabase private Storage first; provider abstraction |
| Custom JWT as primary auth | Supabase Auth as target identity provider |
| `File.currentVersion` represents active file | Published revision is independent from newest upload |
| Generic WIP/Shared/Published/Archived states | Review decision and CDE lifecycle are separate exact-revision records |
| Broad planner/ISO tooling in early scope | Contractor vertical slice first; planner deferred |
| Gemini-backed AI services | OpenAI tool orchestration after authorization/CDE |
| Illustrative browser geometry | Explicit demo only; production BIM needs a later ADR |

The legacy architecture document is now visibly marked historical.

## E. Security findings

### Critical

- Project/file controllers accept direct identifiers while many operations do not enforce organization/project membership, creating likely IDOR/cross-tenant paths for authenticated users.
- No Supabase RLS policies exist in the checked-in migration set.
- File download signing follows lookup without a consistently demonstrated project authorization check.

### High

- Upload authorization derives roles inconsistently and uses invitations as a membership proxy.
- Generic presigned upload returns a public-style URL, uses user-controlled names, and demonstrates no tenant prefix, size/MIME control, malware workflow, or checksum validation.
- CORS is unrestricted; production configuration is not fail-fast; refresh tokens are stored directly rather than hashed.

### Medium

- Integrity-looking audit fields do not make database rows immutable; actor/request metadata is incomplete.
- A 500 MB in-memory upload path creates denial-of-service risk.
- Uploaded documents are a prompt-injection boundary; AI services do not demonstrate evidence isolation and tool authorization.

No confirmed production credential was found. A tracked `.env.vercel` template remains an unsafe convention and should become an example-only file before real deployment secrets are configured.

## F. Technical debt

- The large Prisma schema uses free-form strings for important states and lacks tenant keys/constraints on several child records.
- One migration cannot reproduce the many-model schema from a clean database.
- API identity access alternates between `req.user.id` and `req.user.userId`.
- CI used Node 18 despite a Node 20 requirement, installed non-deterministically, omitted API build, and its archived version allowed tests to fail.
- Root tests depend on production builds, obscuring test versus compile/external asset failures.

## G. Mocked or incomplete integrations

- Supabase Auth/Storage/RLS are not an end-to-end source of truth.
- AI uses an obsolete provider direction rather than the required permission-scoped OpenAI tool layer.
- BIM has demo/illustrative paths and no established production derivative pipeline.
- Local storage fallback, simulated workflows/jobs, email fallback, and dashboard data retain development behavior.
- BITL and Terraform definitions are not reconciled with the current MVP deployment.

## H. Recommended order

1. **Phase 0:** current ADRs; deterministic CI/build; configuration validation; classify routes as production/demo/retire.
2. **Phase 1:** Supabase Auth, memberships, server authorization, RLS, protected routes, and cross-tenant negative tests.
3. **Phase 2:** immutable revisions, exact-revision decisions, atomic publish/supersede, private storage, and audit events.
4. **Phase 3:** mobile current-published PDF flow, QR links, and explicit stale-cache behavior.
5. Defer project control, procurement, OpenAI orchestration, and BIM/worker work until vertical-slice security invariants pass.

## Phase 0 exit criteria

| Gate | Status |
|---|---|
| Architecture and migration approach recorded | Complete (ADR-0001) |
| Legacy architecture marked non-authoritative | Complete |
| Repository/prototype audit | Partial: prototype HTML unavailable |
| Node 20 deterministic CI for lint, typecheck, tests, builds | Implemented; baseline failures remain |
| Environment validation and demo/production mode | Pending next Phase 0 increment |
| Clean database migration reproducibility | Failing: baseline migration required |
| Security baseline | Failing: IDOR/RLS/storage findings block acceptance |

Phase 0 is **partial**, not done. Next: implement a tested fail-fast environment contract and route authorization matrix, then begin Phase 1 tenant foundations.
