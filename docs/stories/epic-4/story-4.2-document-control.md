# Story 4.2: Shop Drawings & Method Statements

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.2`
**Story Points**: 5
**Priority**: P1
**Sprint**: Sprint TBD

## User Story

**As a** Document Controller
**I want to** submit and track Shop Drawings and Method Statements
**So that** I can ensure all technical documents are approved by the MK/Owner before execution.

## Acceptance Criteria

### Functional
- [x] User can upload "Shop Drawing" or "Method Statement" documents.
- [x] User can select an Approval Workflow (from Epic 2).
- [x] System tracks status: Submitted -> Reviewed -> Approved / Approved w/ Notes / Rejected.
- [x] User can view a dashboard of "Approvals Pending".
- [x] System generates a unique reference number (e.g., SD-STR-001).

### Non-Functional
- [x] File upload limit 50MB.

## Technical Tasks

### Backend
- [x] Create `DocumentControlModule`.
- [x] Implement `SubmittalService`.
- [x] Add `Submittal` model to Prisma.
- [x] Endpoint `POST /api/construction/submittals`.
- [x] Integrates with `ApprovalWorkflow` (Epic 2).

### Frontend
- [x] Create `/construction/submittals` page.
- [x] Create `SubmittalForm`.
- [x] Create `SubmittalList` with status badges.

### Database
- [x] Add `Submittal` model.

## Definition of Done
- [x] Schema updated.
- [x] API functional.
- [x] Frontend UI complete.
