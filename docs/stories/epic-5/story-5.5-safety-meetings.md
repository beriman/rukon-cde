# Story 5.5: Safety Meetings (TBM, P2K3)

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.5`  
**Story Points**: 3  
**Priority**: P1 (High)  
**Sprint**: Sprint 17 (Weeks 33-34)

## User Story

**As a** Safety Supervisor,  
**I want to** log safety meetings and track attendance,  
**So that** I can prove communication of hazards to the workforce.

## Acceptance Criteria

### Functional
- [ ] **Meeting Types**: Toolbox Meeting (TBM), Safety Induction, Weekly Safety Meeting, P2K3 Meeting
- [ ] **Attendance**: Digital attendance via QR Code scan or Bulk Select
- [ ] **Minutes**: Record discussion points and photos of the event
- [ ] **Indonesian Context**: "P2K3 (Panitia Pembina K3)" meeting minutes format (mandatory per regulation)
- [ ] **Export**: PDF export of attendance list with signatures

### Data
- [ ] Link attendance to Personnel Record (Story 5.8) for training history

## Technical Tasks

### Backend
- [ ] Create `SafetyMeeting` model
- [ ] PDF Generator for Attendance Sheet

### Frontend
- [ ] QR Code Scanner for attendance
- [ ] Digital Signature pad

## Dependencies
- **Depends on**: Story 5.8 (Personnel)
