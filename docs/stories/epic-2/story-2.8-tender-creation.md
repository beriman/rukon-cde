# Story 2.8: Tender Project Creation & Data Room

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.8`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 8 (Weeks 15-16)

## User Story

**As an** Appointing Party,  
**I want to** create a Tender Project and upload tender documents (EIR, Reference Info) to a secure Data Room,  
**So that** I can invite bidders to access the information securely.

## Acceptance Criteria

### Functional
- [ ] User can create a "Tender" type project (distinct from standard projects)
- [ ] **Data Room**: Special folder structure for tender docs
- [ ] User can upload EIR (generated from Story 2.4) and Reference Information
- [ ] User can set "Tender Period" (Start Date - End Date)
- [ ] Access automatically revoked after End Date

### Security
- [ ] Data Room is read-only for Bidders (cannot delete/overwrite)
- [ ] Watermarking on downloaded documents (optional)

## Technical Tasks

### Backend
- [ ] Update `Project` model to support `type: TENDER`
- [ ] Implement `TenderService` to manage tender lifecycle
- [ ] Add scheduled job to revoke access on expiry

### Frontend
- [ ] Tender Dashboard
- [ ] Data Room UI (simplified file browser)

## Dependencies
- **Depends on**: Story 2.4 (EIR)
