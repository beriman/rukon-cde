# Story 4.3: Material Approvals

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.3`
**Story Points**: 3
**Priority**: P2
**Sprint**: Sprint TBD

## User Story

**As a** Contractor
**I want to** submit material samples and specifications for approval
**So that** I can procure the correct materials as per project specs.

## Acceptance Criteria

### Functional
- [x] User can submit a "Material Approval Request" (MAR).
- [x] Form includes: Material Name, Manufacturer, Spec Reference, Sample Photo/Doc.
- [x] Approval Workflow integration (like Story 4.2).
- [x] Dashboard shows approved vs pending materials.
- [x] Comparison view: Submitted Spec vs Required Spec (text based).

## Technical Tasks

### Backend
- [x] Add `MaterialRequest` to schema (or reuse `Submittal` with type='MATERIAL').
- [x] Endpoint `POST /api/construction/materials`.

### Frontend
- [x] Create `/construction/materials` page.
- [x] Material Request Form.

## Definition of Done
- [x] Schema updated.
- [x] API functional.
- [x] Frontend UI complete.
