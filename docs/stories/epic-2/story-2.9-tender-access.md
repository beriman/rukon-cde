# Story 2.9: Tender Access & Activity Logging

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.9`  
**Story Points**: 5  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 8 (Weeks 15-16)

## User Story

**As an** Appointing Party,  
**I want to** invite bidders and track their activity in the Data Room,  
**So that** I can ensure fair process and audit who accessed what information.

## Acceptance Criteria

### Functional
- [ ] User can invite Bidders via email (Role: BIDDER)
- [ ] Bidders can login and view *only* the Data Room
- [ ] Bidders cannot see other Bidders
- [ ] **Activity Log**: Track every View and Download by Bidders
- [ ] Admin can view "Bidder Activity Report" (e.g., Bidder A downloaded EIR on [Date])

### Security
- [ ] Strict isolation: Bidder A must never know Bidder B exists

## Technical Tasks

### Backend
- [ ] Implement `BidderGuard` to enforce isolation
- [ ] Enhanced Audit Logging for Tender events
- [ ] Generate Activity Report (CSV/PDF)

### Frontend
- [ ] Bidder Management UI (Invite/Revoke)
- [ ] Activity Report Visualization

## Dependencies
- **Depends on**: Story 2.8 (Tender Project)
