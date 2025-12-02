# Story 4.6: Payment & Billing (Progress Claims)

**Epic**: Epic 4 - Construction Monitoring & Document Control  
**Story ID**: `story-4.6`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 15 (Weeks 29-30)

## User Story

**As a** Contractor,  
**I want to** submit Progress Claims and track Variation Orders (VO),  
**So that** I can get paid for work done and approved variations.

## Acceptance Criteria

### Functional
- [ ] **Progress Claim**: Generate claim based on % completion of BQ items
- [ ] **VO Management**: Create Variation Order -> Approval Workflow -> Add to Contract Sum
- [ ] **Retention**: Auto-calculate Retention Sum (e.g., 5%)
- [ ] **Indonesian Context**: Terminology: "Berita Acara Pembayaran (BAP)", "Termin", "Retensi", "Pajak (PPN/PPh)"
- [ ] **Export**: Generate Payment Certificate PDF

### Security
- [ ] **Immutable**: Approved claims cannot be edited, only "Adjusted" in next claim

## Technical Tasks

### Backend
- [ ] Create `ProgressClaim` and `VariationOrder` models
- [ ] Implement Calculation Engine (Claim Amount = (BQ% * Rate) + VO - Retention - Previous Paid)
- [ ] **Precision**: Use `decimal.js` or store values as integers (cents) to avoid floating point errors
- [ ] **Testing**: Add unit tests for tax rounding (PPN 11%, PPh) to ensure 1-rupiah accuracy

### Frontend
- [ ] Claim Editor (Spreadsheet-like interface)
- [ ] VO Log

## Dependencies
- **Depends on**: Story 4.5 (BQ Data)
