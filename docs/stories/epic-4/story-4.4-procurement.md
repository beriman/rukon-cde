# Story 4.4: Procurement & BQ Monitoring

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.4`
**Story Points**: 5
**Priority**: P2
**Sprint**: Sprint TBD

## User Story

**As a** Quantity Surveyor (QS)
**I want to** monitor procurement of long lead items and track BQ usage
**So that** I can prevent material shortages and budget overruns.

## Acceptance Criteria

### Functional
- [x] User can import a "Long Lead Item" (LLI) list (CSV/Excel).
- [x] Track LLI Status: Ordered -> Manufactured -> Shipping -> On Site.
- [x] User can link BQ items to Work Packages (from Story 4.1).
- [x] Dashboard shows "Planned vs Actual" quantity usage.

## Technical Tasks

### Backend
- [x] Add `ProcurementItem` model.
- [x] Add `BillOfQuantities` model.
- [x] Endpoint `POST /api/construction/procurement/import`.

### Frontend
- [x] Create `/construction/procurement` page.
- [x] Kanban board for LLI tracking.

## Definition of Done
- [x] Schema updated.
- [x] Import function works.
- [x] Frontend UI complete.
