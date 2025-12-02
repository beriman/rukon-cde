# Story 5.6: Permit to Work (PTW) System

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.6`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 17 (Weeks 33-34)

## User Story

**As a** Site Supervisor,  
**I want to** request and manage Permits to Work (PTW) digitally,  
**So that** high-risk activities are controlled and authorized properly.

## Acceptance Criteria

### Functional
- [ ] **Permit Types**: Hot Work, Confined Space, Working at Height, Excavation, Lifting
- [ ] **Workflow**: Request -> Safety Review -> Approval (Site Manager) -> Issue -> Close
- [ ] **JSA Link**: Mandatory Job Safety Analysis (JSA) attachment
- [ ] **Indonesian Context**: "Surat Izin Kerja Aman (SIKA)", "JSA (Job Safety Analysis)"
- [ ] **Dashboard**: View Active, Expiring, and Closed permits
- [ ] **Expiry**: Auto-notification 1 hour before permit expires

### Security
- [ ] **Digital Signature**: Approvers must sign digitally (PIN or signature pad)
- [ ] **Geo-fencing**: (Optional) Approval only allowed within site radius

## Technical Tasks

### Backend
- [ ] Implement PTW State Machine with expiry logic
- [ ] Scheduled job to check for expiring permits
- [ ] **Testing**: Add unit tests for Expiry Logic (e.g., expires during weekends/holidays)
- [ ] **Testing**: Add mock GPS test cases for Geo-fencing validation

### Frontend
- [ ] PTW Form with multi-step wizard
- [ ] "Permit Board" visualization (Kanban style)

## Dependencies
- **Depends on**: Epic 2 (Approval Workflows)
