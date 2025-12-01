# Story 2.5: BEP Editor (BIM Execution Plan)

**Epic**: Epic 2 - ISO 19650-2 Strategic Planning & Delivery  
**Story ID**: `story-2.5`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 7 (Weeks 13-14)

## User Story

**As a** Lead Appointed Party (Main Contractor/Lead Consultant),  
**I want to** create and edit a BIM Execution Plan (BEP) online,  
**So that** I can demonstrate how my team will meet the EIR requirements.

## Acceptance Criteria

### Functional
- [ ] User can create Pre-appointment BEP (response to tender) and Post-appointment BEP (confirmed plan)
- [ ] Editor supports standard BEP sections: Project Goals, Roles & Responsibilities, CDE Strategy, Collaboration Procedures
- [ ] **Indonesian Template**: Default template follows ISO 19650-2 with Indonesian terminology
- [ ] User can invite other team members to collaborate on BEP drafting
- [ ] Version control for BEP revisions
- [ ] Export to PDF

### Integration
- [ ] Link to EIR (to show compliance)
- [ ] Auto-populate Project Information

## Technical Tasks

### Backend
- [ ] Create `BEP` data model
- [ ] Implement collaborative editing support (optional: WebSocket for real-time, or just locking) -> *MVP: Optimistic locking*
- [ ] Implement `POST /api/bep/publish` (creates immutable version)
- [ ] **Export**: Implement PDF generation using `docx` or `pdfmake` (ensure table formatting works)

### Frontend
- [ ] BEP Editor with section navigation
- [ ] "Comment" feature on specific sections for review

## Dependencies
- **Depends on**: Story 2.4 (EIR)
- **Blocks**: Story 2.10 (Mobilization)
