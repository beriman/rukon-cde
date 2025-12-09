# Story 4.5: Payment & Billing

**Epic**: Epic 4 - Construction Monitoring Suite
**Story ID**: `story-4.5`
**Story Points**: 8 (Complex)
**Priority**: P2
**Sprint**: Sprint TBD

## User Story

**As a** Contractor
**I want to** submit progress claims and track invoice status
**So that** I can get paid for the work completed.

## Acceptance Criteria

### Functional
- [x] User can create a "Progress Claim" based on % completion of Work Packages (Story 4.1).
- [x] User can log "Variation Orders" (VO) with cost impact.
- [x] System calculates Total Claim Amount = (Base Contract * %) + Approved VOs.
- [x] Status tracking: Draft -> Submitted -> Certified -> Invoiced -> Paid.

## Technical Tasks

### Backend
- [x] Add `ProgressClaim` and `VariationOrder` models.
- [x] Logic to aggregate WorkPackage progress > Claim amount.
- [x] Endpoints for Claims and VOs.

### Frontend
- [x] Create `/construction/commercial` page.
- [x] Claim creation wizard.

## Definition of Done
- [x] Schema updated.
- [x] Claim calculation logic verified.
- [x] Frontend UI complete.
