# Story 5.3: Incident Investigation & RCA

**Epic**: Epic 5 - HSE Management & Safety Monitoring  
**Story ID**: `story-5.3`  
**Story Points**: 8  
**Priority**: P1 (High)  
**Sprint**: Sprint 16 (Weeks 31-32)

## User Story

**As a** Lead Investigator,  
**I want to** conduct Root Cause Analysis (RCA) for incidents,  
**So that** corrective actions can be implemented to prevent recurrence.

## Acceptance Criteria

### Functional
- [ ] **Investigation Workflow**: Assigned -> In Progress -> Review -> Closed
- [ ] **RCA Tools**: Built-in "5 Whys" form and "Fishbone Diagram" builder
- [ ] **Corrective Actions**: Assign tasks to users with due dates (linked to Incident)
- [ ] **Indonesian Context**: Terminology: "Investigasi Kecelakaan", "Tindakan Perbaikan & Pencegahan (TPP)"
- [ ] **Report**: Generate Investigation Report PDF

### Data
- [ ] Track "Days to Close" metric (Target: < 30 days)

## Technical Tasks

### Backend
- [ ] Create `Investigation` and `CorrectiveAction` models
- [ ] Implement RCA data structure (JSON)

### Frontend
- [ ] Interactive Fishbone Diagram component (using `react-flow` or similar)
- [ ] Action Tracking Dashboard

## Dependencies
- **Depends on**: Story 5.2 (Incident)
