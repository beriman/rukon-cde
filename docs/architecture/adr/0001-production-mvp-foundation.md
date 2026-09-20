---
title: "ADR-0001: Production MVP Foundation"
author: Beriman Juliano
project: Ruang Konstruksi
status: accepted
date: 2026-09-20
---

# ADR-0001: Production MVP Foundation

## Context

The repository is a substantial Next.js/NestJS monorepo, not a blank project. It contains reusable UI, domain services, a Prisma/PostgreSQL schema, and tests, but its broad ISO 19650 prototype scope predates the contractor-first direction. The first production milestone must prove tenant-safe access to an exact, approved, published document revision on mobile.

## Decision

1. **Preserve the application boundary.** Next.js remains the responsive web/PWA client and NestJS remains the only public business API. Browser code must not receive a service-role credential or perform privileged workflow writes.
2. **Adopt Supabase incrementally.** Supabase PostgreSQL, Auth, and private Storage are the target platform. Prisma may remain in NestJS during migration, provided migrations also install and test RLS. Existing custom JWT auth is transitional.
3. **Use shared-schema tenancy.** Every project-owned aggregate must be reachable through `organization_id` and `project_id`. RLS and NestJS authorization are independent controls. Database-per-tenant is rejected for this MVP.
4. **Migrate the CDE as a vertical slice.** Introduce explicit document, immutable revision, revision decision, publication, and append-only audit records. Do not retrofit publication semantics onto `File.currentVersion`: newest upload and current published revision are different facts.
5. **Abstract object storage.** Business services depend on a storage port. Supabase private Storage is the first adapter; signed downloads are short lived and authorized before signing. Local disk is development-only, never a production fallback.
6. **Keep demo behavior explicit.** Synthetic records, illustrative BIM, fake AI, and simulated jobs must be labelled `DEMO` or `Belum terhubung` and cannot feed production decisions.
7. **Defer irreversible BIM selection.** APS versus IFC versus hybrid requires a separate ADR. Revit execution remains out of scope until the generic job architecture is safe and idempotent.

## Migration sequence

1. Establish reproducible CI and configuration validation.
2. Add Supabase Auth verification, organizations, project memberships, roles, server authorization, and RLS with cross-tenant negative tests.
3. Add production CDE tables and a storage adapter alongside legacy `File`.
4. Ship exact-revision review/publish workflow and its audit trail.
5. Move field UI to the current-published query; retire legacy paths only after regression coverage proves parity.

No destructive migration of existing metadata is permitted. A backfill must be repeatable, checksum source objects, record exceptions, and support a read-only rollback window.

## Required Phase 1/2 security invariants

- A project identifier supplied by a client never establishes access.
- Membership is checked for list, detail, upload, review, download, and transitions, including indirect folder/revision identifiers.
- A reviewer decision references one immutable revision and authenticated actor.
- Publication is permission-gated and atomic; it supersedes the prior publication without deleting it.
- Objects are private, use opaque identities, are size/type checked, and are accessed through expiring signed URLs.
- Audit events are append-only to application roles and record security-significant failures as well as successful transitions.

## Consequences

This reuses the current stack and permits gradual delivery, but two authorization layers and a temporary legacy/new CDE overlap increase testing and operations effort. That cost is accepted because it makes tenant isolation testable and avoids a high-risk rewrite.
