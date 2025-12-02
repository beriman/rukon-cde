# Story 8.7: Handover Wizard (PIM to AIM)

**Epic**: Epic 8 - Security, Compliance & Lifecycle  
**Story ID**: `story-8.7`  
**Story Points**: 5  
**Priority**: P1 (High)  
**Sprint**: Sprint 28 (Weeks 55-56)

## User Story

**As a** Project Manager,  
**I want to** migrate project data to operations phase,  
**So that** handover is smooth and complete.

## Acceptance Criteria

### Functional
- [ ] **Wizard Steps**: As-built Model, COBie Data, O&M Docs, Training Records
- [ ] **Validation**: Check completeness before handover
- [ ] **PIM → AIM**: Migrate data to Asset Twin database
- [ ] **Report**: Generate Handover Report PDF

## Technical Tasks

### Backend
- [ ] Implement Handover state machine
- [ ] Data migration logic (PIM to AIM)

## Dependencies
- **Depends on**: Story 8.5 (Asset Twin)
